from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
import datetime
from langchain_community.document_loaders import TextLoader, CSVLoader
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain.memory import ConversationBufferMemory
from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain


current_date = datetime.date.today()

# CPT_FILE_PATH ='2025_DHS_Code_List_Addendum_11_26_2024.txt'

# Loading up the documents
# cpt_loader = TextLoader(
#     CPT_FILE_PATH,
#     encoding='ISO-8859-1'
# )
# data = cpt_loader.load()

CSV_PATH = "vaFssPharmPrices.csv"
csv_loader = CSVLoader(file_path=CSV_PATH)
data = csv_loader.load()

# Chunk the text into manageable pieces
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
docs = text_splitter.split_documents(data)

# Using Google Generative AI to create embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))

# Store the document chunks and their embeddings in a FAISS VectorDB
db = FAISS.from_documents(docs, embeddings)
retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 2})

# Set up memory to remember the conversation
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Use the Google Generative AI model for conversational queries
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.0)

# Refine the system prompt to allow for conversational interaction
system_prompt = (
    """
    You are a medical coding assistant. I will give you descriptions of medical procedures or symptoms.
    You will provide the corresponding CPT codes, using the context of past conversations to give accurate and detailed responses.
    Feel free to ask for more details if something is unclear, and maintain a conversational tone.
    """
    "\n\n"
    "{context}"
)

# Set up the prompt to include conversation history
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        ("human", "{input}")
    ]
)

# Create the RAG chain to handle document retrieval and interaction
chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, chain)

# Example interaction - querying the system
while True:
    user_input = input("You: ")
    
    # Use the conversational retrieval chain to respond based on past conversation and current input
    response = rag_chain.invoke({"input": user_input, "chat_history": memory.buffer})
    
    # Get the answer and update the memory with the user's message and the response
    answer = response["answer"]
    print("Assistant: " + answer)
    
    
    
    # Ask the user if they want to continue or end the conversation
    continue_conversation = input("Do you want to ask anything else? (yes/no): ").strip().lower()
    if continue_conversation != 'yes':
        break
