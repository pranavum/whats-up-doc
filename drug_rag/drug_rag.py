# import os
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain.vectorstores import FAISS
# from langchain_core.prompts import MessagesPlaceholder
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.chains import create_retrieval_chain
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_community.document_loaders import TextLoader, CSVLoader
# from langchain.memory import ConversationBufferMemory


# def load_data(csv_file_path):
#     """Loads data from a CSV file."""
#     loader = CSVLoader(file_path=csv_file_path)
#     return loader.load()

# def split_text(data, chunk_size=1000, chunk_overlap=200):
#     """Splits documents into smaller chunks."""
#     text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
#     return text_splitter.split_documents(data)

# def create_embedder():
#     """Creates embeddings using Google Generative AI."""
#     return GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))

# def get_retriever(docs, embeddings):
#     """Creates a FAISS vector database from document chunks."""
#     db = FAISS.from_documents(docs, embeddings)
#     return db.as_retriever(search_type="similarity", search_kwargs={"k": 2})

# def create_memory():
#     """Initializes conversation memory for the RAG model."""
#     return ConversationBufferMemory(memory_key="chat_history", output_key="AI", return_messages=True)

# def create_rag_chain(retriever, memory):
#     """Creates the retrieval-augmented generation (RAG) chain."""
#     system_prompt = (
#         """
#         You are a professional medical coder, who is an assistant for new doctors and new medical coders to guide them. Given a
#         description of patient's condition, any tests run, as well as context from the chat history, your job is to output relevant
#         CPT or ICD-10 medical codes.
#         """
#         "\n\n{context}"
#     )
#     llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.0)
#     prompt = ChatPromptTemplate.from_messages([
#         ("system", system_prompt),
#         MessagesPlaceholder("chat_history"),
#         ("human", "{input}")
#     ])
#     chain = create_stuff_documents_chain(llm, prompt)
#     return create_retrieval_chain(retriever, chain)

# def chat_loop(rag_chain, memory):
#     """Runs the interactive chat loop."""
#     while True:
#         user_input = input("You: ")
#         if user_input.lower() == "exit":
#             break
#         ai_response = rag_chain.invoke({
#             "input": user_input,
#             "chat_history": memory.buffer
#         })
#         answer = ai_response['answer']
#         print(f"Assistant: {answer}")
#         memory.save_context(
#             inputs={"input": user_input, "chat_history": memory.buffer},
#             outputs={"User": user_input, "AI": answer}
#         )

# def main():
#     csv_file_path = '/Users/sakethkoona/Documents/Coding Stuff/Hackylytics2025/whats-up-doc/drug_rag/vaFssPharmPrices.csv'
#     data = load_data(csv_file_path)
#     docs = split_text(data)
#     embeddings = create_embedder()
#     retriever = get_retriever(docs, embeddings)
#     memory = create_memory()
#     rag_chain = create_rag_chain(retriever, memory)
#     chat_loop(rag_chain, memory)

# if __name__ == "__main__":
#     main()

import os
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import FAISS
from langchain_core.prompts import MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import CSVLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain.memory import ConversationBufferMemory
import pypdf

def load_data(csv_file_path):
    """Loads data from a CSV file."""
    loader = CSVLoader(file_path=csv_file_path)
    return loader.load()

def load_user_file(file_path):
    """Loads user-uploaded PDF file for additional context."""
    loader = PyPDFLoader(file_path)
    return loader.load()

# def add_uploaded_data_to_vectorstore(file_path, retriever):
#     """Processes the uploaded file and updates the retriever."""
#     user_data = load_user_file(file_path)
#     docs = split_text(user_data)
#     embeddings = create_embedder()
#     return get_retriever(docs, embeddings)

def add_uploaded_data_to_vectorstore(file_path, retriever):
    """Processes the uploaded file and updates the retriever."""
    
    user_data = load_user_file(file_path)
    docs = split_text(user_data)
    
    retriever.vectorstore.add_documents(docs)
    
    return retriever

def split_text(data, chunk_size=1000, chunk_overlap=200):
    """Splits documents into smaller chunks."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return text_splitter.split_documents(data)

def create_embedder():
    """Creates embeddings using Google Generative AI."""
    return GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))

def get_retriever(docs, embedder):
    """Creates a FAISS vector database from document chunks."""
    db = FAISS.from_documents(docs, embedder)
    return db.as_retriever(search_type="similarity", search_kwargs={"k": 2})

def create_memory():
    """Initializes conversation memory for the RAG model."""
    return ConversationBufferMemory(memory_key="chat_history", output_key="AI", return_messages=True)

def create_rag_chain(retriever, memory):
    """Creates the retrieval-augmented generation (RAG) chain."""
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
    return create_retrieval_chain(retriever, chain)

def chat_loop(rag_chain, memory):
    """Runs the interactive chat loop."""
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        else:
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
    embedder = create_embedder()
    retriever = get_retriever(docs, embedder)
    memory = create_memory()
    
    # Simulate file upload from frontend
    uploaded_file_path = '/Users/sakethkoona/Documents/Coding Stuff/Hackylytics2025/whats-up-doc/drug_rag/sample_insurance.form.pdf'  # This should be set by the frontend
    if uploaded_file_path:
        retriever = add_uploaded_data_to_vectorstore(uploaded_file_path, retriever) # Adds the additional information if any to the database
    
    rag_chain = create_rag_chain(retriever, memory)
    chat_loop(rag_chain, memory)







if __name__ == "__main__":
    main()

