from src import db
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func
from sqlalchemy.orm import relationship

class Chat(db.Model):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())


    #relacionamentos
    user = relationship("User", back_populates="chats")
    messages =  relationship(
        "Messages",
        back_populates="chat",
        cascade="all, delete-orphan",
    )

