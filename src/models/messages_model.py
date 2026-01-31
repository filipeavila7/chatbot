from src import db
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func, Text
from sqlalchemy.orm import relationship


class Messages(db.Model):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)

    role = Column(
        String(20), 
        nullable=False
        # valores: user | assistant | system
    )

    content = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    chat = relationship("Chat", back_populates="messages")