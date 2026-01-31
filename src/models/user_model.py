from src import db
from sqlalchemy import String, Integer, Column
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), nullable=False )
    password = Column(String(120), nullable=False )
    email = Column(String(120), nullable=False, unique=True)

    chats = db.relationship(
        "Chat",
        back_populates="user",
        cascade="all, delete-orphan"
    )

