import datetime
from uuid import uuid4
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import UUID, Column, ForeignKey, String, DateTime

class Base(DeclarativeBase):
    pass

class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID, primary_key=True, default=uuid4)
    role = Column(String)
    content = Column(String)
    chat_id = Column(UUID, ForeignKey("chats.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return f"Message(id={self.id!r}, role={self.role!r}, content={self.content!r}, chat_id={self.chat_id!r})"

class Chat(Base):
    __tablename__ = "chats"
    id = Column(UUID, primary_key=True, default=uuid4)
    chat_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return f"Chat(id={self.id!r}, chat_name={self.chat_name!r}, created_at={self.created_at!r}, updated_at={self.updated_at!r})"