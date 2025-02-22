import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import FAISS
from langchain_core.prompts import MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import TextLoader, CSVLoader
from langchain.memory import ConversationBufferMemory

os.environ["GOOGLE_API_KEY"] = 'AIzaSyCqoB9mIoVEzp_hbCe7xpw3ZytSqD5vkwA'

def load_data(csv_file_path):
    """Loads data from a CSV file."""
    loader = CSVLoader(file_path=csv_file_path)
    return loader.load()

def split_text(data, chunk_size=1000, chunk_overlap=200):
    """Splits documents into smaller chunks."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return text_splitter.split_documents(data)

def create_embeddings():
    """Creates embeddings using Google Generative AI."""
    return GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))

def create_vector_db(docs, embeddings):
    """Creates a FAISS vector database from document chunks."""
    db = FAISS.from_documents(docs, embeddings)
    return db.as_retriever(search_type="similarity", search_kwargs={"k": 2})

def create_memory():
    """Initializes conversation memory for the RAG model."""
    return ConversationBufferMemory(memory_key="chat_history", output_key="AI", return_messages=True)

def create_rag_chain(retriever, memory):
    """Creates the retrieval-augmented generation (RAG) chain."""
    system_prompt = (
        """
        You are a professional medical coder, who is an assistant for new doctors and new medical coders to guide them. Given a
        description of patient's condition, any tests run, as well as context from the chat history, your job is to output relevant
        CPT or ICD-10 medical codes.
        """
        "\n\n{context}"
    )
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ])
    chain = create_stuff_documents_chain(llm, prompt)
    return create_retrieval_chain(retriever, chain)

def chat_loop(rag_chain, memory):
    """Runs the interactive chat loop."""
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        ai_response = rag_chain.invoke({
            "input": user_input,
            "chat_history": memory.buffer
        })
        answer = ai_response['answer']
        print(f"Assistant: {answer}")
        memory.save_context(
            inputs={"input": user_input, "chat_history": memory.buffer},
            outputs={"User": user_input, "AI": answer}
        )

def main():
    csv_file_path = '/Users/sakethkoona/Documents/Coding Stuff/Hackylytics2025/whats-up-doc/drug_rag/vaFssPharmPrices.csv'
    data = load_data(csv_file_path)
    docs = split_text(data)
    embeddings = create_embeddings()
    retriever = create_vector_db(docs, embeddings)
    memory = create_memory()
    rag_chain = create_rag_chain(retriever, memory)
    chat_loop(rag_chain, memory)

if __name__ == "__main__":
    main()
