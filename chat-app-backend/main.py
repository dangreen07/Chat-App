from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from schema import Chat
from schema import Message as DBMessage

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

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

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    chat_id: str

@app.post("/chat")
async def chat(request: ChatRequest):
    def event_stream():
        full_message = ""
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
            full_message += content
            yield content.encode("utf-8")
        ## Once the stream is complete, save the message to the database
        with Session(engine) as session:
            user_message = request.messages[-1]
            user_message = DBMessage(role=user_message.role, content=user_message.content, chat_id=request.chat_id)
            session.add(user_message)
            message = DBMessage(role="assistant", content=full_message, chat_id=request.chat_id)
            session.add(message)
            session.commit()

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.post("/new-chat")
async def new_chat():
    with Session(engine) as session:
        chat = Chat()
        session.add(chat)
        session.commit()
        return { "chat_id": chat.id }

@app.get("/chat/{chat_id}/messages")
async def get_chat(chat_id: str):
    with Session(engine) as session:
        messages = session.query(DBMessage).filter(DBMessage.chat_id == chat_id).all()
        return { "messages": messages }

@app.post("/chat/{chat_id}/auto-name")
async def auto_name(chat_id: str):
    with Session(engine) as session:
        messages = session.query(DBMessage).filter(DBMessage.chat_id == chat_id).all()
        if len(messages) == 0:
            return {"error": "No messages in chat"}
        messages = [{"role": message.role, "content": message.content} for message in messages]
        response = client.responses.create(
            model="gpt-4.1-nano",
            input=[
                *messages,
                {"role": "system", "content": "You are a helpful assistant. You will NEVER use em-dashes. You will output in markdown format. You will output a short description of the chat that is a good name for a chat."},
                {"role": "user", "content": "Give me an insightful description for this chat. Not too detailed, or long. 3-5 words."}
            ],
            store=True
        )
        session.query(Chat).filter(Chat.id == chat_id).update({"chat_name": response.output_text})
        session.commit()
        return { "name": response.output_text }

@app.get("/chats")
async def get_chats():
    with Session(engine) as session:
        chats = session.query(Chat).all()
        return { "chats": chats }

@app.get("/chat/{chat_id}")
async def get_chat(chat_id: str):
    with Session(engine) as session:
        chat = session.query(Chat).filter(Chat.id == chat_id).first()
        return { "chat": chat }

@app.get("/health")
async def health():
    return { "status": "healthy" }