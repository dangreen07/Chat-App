from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

@app.post("/chat")
async def chat(request: ChatRequest):
    response = client.responses.create(
        model="gpt-4.1-nano",
        input=[
            {
                "role": "system",
                "content": "You are a helpful assistant."
            },
            *request.messages
        ]
    )

    return {"message": response.output_text}

@app.get("/health")
async def health():
    return {"status": "healthy"}