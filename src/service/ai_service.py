import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Inicializa o cliente fora da função para melhor performance
client = genai.Client(api_key=API_KEY)

def generate_response(messages):
    if not API_KEY:
        return "Erro: chave da API não configurada."

    try:
        # O SDK prefere receber a lista de mensagens estruturada
        # ou apenas o último conteúdo se for um chat simples.
        # Aqui, enviamos a última mensagem do usuário:
        last_message = messages[-1]["content"]

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=last_message,
            config={
                "max_output_tokens": 2048,
                "temperature": 0.7,
            }
        )

        return response.text.strip()

    except Exception as e:
        print(f"❌ Erro ao gerar resposta com o Gemini: {e}")
        return "Erro ao conectar com a IA."