from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

origins = [
    os.getenv("FRONTEND_URL")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

@app.post("/chat")
async def chat(request: ChatRequest):
    def event_stream():
        for chunk in client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system",
                 "content": "You are a helpful assistant. You will NEVER use em-dashes. You will output in markdown format."},
                *request.messages,
            ],
            stream=True,
        ):
            content = chunk.choices[0].delta.content or ""
            yield content.encode("utf-8")

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.get("/health")
async def health():
    return {"status": "healthy"}