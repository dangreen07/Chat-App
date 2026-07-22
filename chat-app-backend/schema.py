import datetime
from uuid import uuid4
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import UUID, Column, ForeignKey, String, DateTime, Boolean

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
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    chat_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return f"Chat(id={self.id!r}, chat_name={self.chat_name!r}, created_at={self.created_at!r}, updated_at={self.updated_at!r})"

class User(Base):
    __tablename__ = "users"
    id = Column(UUID, primary_key=True, default=uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return f"User(id={self.id!r}, email={self.email!r})"

class Session(Base):
    __tablename__ = "sessions"
    id = Column(UUID, primary_key=True, default=uuid4)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return f"Session(id={self.id!r}, user_id={self.user_id!r})"