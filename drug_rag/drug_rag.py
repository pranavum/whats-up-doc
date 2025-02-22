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


SYSTEM_PROMPT = (
    """
    You are a professional medical coder, who is an assistant for new doctors and new medical coders to guide them. Given a
    description of patient's condition, any tests run, as well as context from the chat history, your job is to output relevant
    CPT or ICD-10 medical codes.
    """
    "\n\n"
    "{context}"
)

CPT_FILE_PATH ='/Users/sakethkoona/Documents/Coding Stuff/Hackylytics2025/whats-up-doc/2025_dhs_code_list_addendum_11_26_2024 (1)/2025_DHS_Code_List_Addendum_11_26_2024.txt'
CSV_FILE_PATH = '/Users/sakethkoona/Documents/Coding Stuff/Hackylytics2025/whats-up-doc/vaFssPharmPrices.csv'

# Loading up the documents
# cpt_loader = TextLoader(
#     CPT_FILE_PATH,
#     encoding='ISO-8859-1'
# )
# data = cpt_loader.load()

loader = CSVLoader(file_path=CSV_FILE_PATH)
data = loader.load()

# Need to chunk the text up
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
docs = text_splitter.split_documents(data)

# Need to take the respective chunks and make text representaions
# I am also using the google gemini to make my questions
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=os.getenv("GOOGLE_API_KEY"))

# Now store your chunks and their embeddings in a VectorDB
db = FAISS.from_documents(docs, embeddings)
retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 2})

# So the RAG can see past chat history
memory = ConversationBufferMemory(
    memory_key="chat_history",
    output_key="AI",
    return_messages=True,
)

# Now to use the actual llm to make the question answering
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.0)

# Set up the prompt for the QA chain
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}")
    ]
)

# Create the RAG chain
chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, chain)


print('\n\n\n\n\n\n')



if __name__ == "__main__":

    while True:
        user_input = input("You: ")

        if user_input == "exit":
            break

        ai_response = rag_chain.invoke({
            "input": user_input,
            "chat_history": memory.buffer
        })
        answer = ((ai_response['answer']))

        print(f"Assistant: {answer}")

        memory.save_context(
            inputs={
                "input": user_input,
                "chat_history": memory.buffer
            },
            outputs={
                "User": user_input,
                "AI": answer
            }
        )
        