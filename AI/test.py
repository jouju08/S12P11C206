from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
load_dotenv()

llm = ChatOpenAI(model="gpt-3.5-turbo")
message = llm.invoke("Hello, how are you?")
print(message)
