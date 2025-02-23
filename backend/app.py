from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import os
from dotenv import load_dotenv
import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import FAISS
from langchain_core.prompts import MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import CSVLoader, TextLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain.memory import ConversationBufferMemory
import pypdf
import assemblyai as aai


load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes (for now, can refine later)

csv_file_path = 'data/vaFssPharmPrices.csv'

loader = CSVLoader(csv_file_path)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
embedder = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))
memory = ConversationBufferMemory(memory_key="chat_history", output_key="AI", return_messages=True)


# Setting up RAG stuff
data = loader.load()
docs = text_splitter.split_documents(data)
db_store = FAISS.from_documents(docs, embedder)
base_retreiver = db_store.as_retriever(search_type='similarity', search_kwargs={'k': 2})

# Configure Gemini API client
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable not set.")
else:
    print("We got the GOOGLE_API_KEY working properly.")
# client = genai.Client(api_key=api_key)


def process_patient_pdf(insur_doc): # insurdoc is a file storage object from flask
    pdf_reader = PyPDF2.PdfReader(insur_doc)
    text = ''

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()
    
    text_file_path = 'insur_doc.txt'
    with open(text_file_path, 'w', encoding='utf-8') as f:
        f.write(text)

    return text_file_path


def create_rag_chain(retreiver):
    system_prompt = (
        """
        You are a knowledgeable pharmaceutical assistant specializing in helping new doctors select the best brand-name drug options based on 
        generic drug names. Your goal is to provide accurate and cost-effective recommendations tailored to patient needs.

        **Your Responsibilities:**
        - Given a generic drug name, suggest equivalent trade-name options.
        - For example, if the user wants some options for Acetaminophen, I want you to give some market options with Acetaminophen such as Tylenol, among others.
        - Factor in patient insurance coverage and past medical history (if available) to recommend cost-effective or preferred options.
        - If there are multiple options, explain the key differences in terms of efficacy, side effects, and pricing, in a digestible, concise format.
        
        **Additional Context:**
        - Use uploaded patient history files (PDFs) to check for contraindications or insurance limitations.
        - A Dataset containing information about the generic drug name, equivalent brand drug names, providers, as well as price information.
        - Provide clear, concise explanations for new doctors unfamiliar with brand-name equivalents.
        
        Given the provided drug details, chat history, and uploaded documents, generate the most suitable recommendations.

        \n\n{context}
        """
    )
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.5)
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ])
    chain = create_stuff_documents_chain(llm, prompt)
    return create_retrieval_chain(retreiver, chain)


def call_gemini_with_rag(prompt_text, retreiver, patient_file_content=None):
    print("Calling Gemini with prompt:", prompt_text)

    if patient_file_content: # Debugging purposes
        print("Patient file content received (first 50 chars):", patient_file_content[:50] + "...")

    try:
        if patient_file_content: # If we have an uploaded patient file, we add it to the retreiver and then create that rag chain
            patient_file_text_path = process_patient_pdf(patient_file_content)

            patient_data_loader = TextLoader(patient_file_text_path, encoding='utf-8')
            docs = patient_data_loader.load()

            retreiver.vectorstore.add_documents(docs)
            rag_chain = create_rag_chain(retreiver)
        else: # Else, we just create the rag chain with the base retreiver
            rag_chain = create_rag_chain(retreiver)


        ai_response = rag_chain.invoke(
            {
            "input": prompt_text,
            "chat_history": memory.buffer
            }
        )

        answer = ai_response['answer']

        print("Gemini API Response:", answer) # Print the entire response object for inspection

        memory.save_context(
                inputs={
                    "input": prompt_text, 
                    "chat_history": memory.buffer
                    },
                outputs={
                    "User": prompt_text, 
                    "AI": answer}
            )
        
        if answer:
            return {"llm_response": answer} # Return the raw text response from Gemini
        else:
            return {"error": "Gemini API returned no text response.", "full_response": str(ai_response)} # Include full response for debugging

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {"error": f"Failed to call Gemini API: {e}", "exception": str(e)}



@app.route('/api/drug-info', methods=['POST'])
def get_drug_info(): # This represents one pass into the LLM (input -> output)
    prompt_text = request.form.get('promptText')
    patient_file = request.files.get('patientFile')

    if not prompt_text:
        return jsonify({"error": "Prompt text is required"}), 400

    llm_response = call_gemini_with_rag(prompt_text, base_retreiver, patient_file)

    return jsonify(llm_response)

# This method is the API endpoint for the sentiment analysis part
@app.route('/api/sent-analysis', methods=['GET'])
def sent_analysis():

    aai.settings.api_key = "3c803922a90e471fa816f8ee7a83a782"

    audio_file = "/data/voice_memos/voice_memo_1.m4a"

    # Transcribe the audio file
    config = aai.TranscriptionConfig(sentiment_analysis=True)
    transcript = aai.Transcriber().transcribe(audio_file, config)

    # Initialize the language model
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0,
        max_tokens=None
    )

    # Create the sentiment string from transcript analysis
    sentiment = ""
    for sentiment_result in transcript.sentiment_analysis:
        sentiment += str(sentiment_result.sentiment)  # POSITIVE, NEUTRAL, or NEGATIVE
        sentiment += str(sentiment_result.confidence)

    # Prepare the message to send to the language model
    messages = [
        (
            "system",
            """
            You are a doctor's assistant. You analyze patient voicemail transcripts and summarize their condition.
            You also suggest possible next steps for the doctor. Your job is purely to summarize and suggest what the 
            doctor should do in this situation based on proper medical protocols.
            """
        ),
        ("human", transcript.text + sentiment),
    ]

    # Invoke the language model
    ai_msg = llm.invoke(messages)

    # Access the content properly using .content attribute
    summary = ai_msg.content.strip().replace('\n', ' ')

    # Print or use the summary as needed
    return summary



if __name__ == '__main__':
    app.run(debug=True)
