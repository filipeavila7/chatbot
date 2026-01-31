from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# teste de conexão
models = genai.Models.list()
print(models)
