from src import db
from src.models.chats_model import Chat

def new_chat(user_id, title):
    db_chat = Chat(
        user_id = user_id,
        title = title
    )
    db.session.add(db_chat)
    db.session.commit()
    return db_chat


def list_chats_by_user(user_id):
    db_chat = Chat.query.filter_by(user_id=user_id).order_by(Chat.created_at.desc()).all()
    return db_chat


def delete_chat(chat_id):
    db_chat = Chat.query.get(chat_id)

    if not db_chat:
        return None
    
    db.session.delete(db_chat)
    db.session.commit()
    return db_chat


def get_chat_by_id(chat_id):
    return Chat.query.get(chat_id)


def get_chat_by_id_and_user(chat_id, user_id):
    return Chat.query.filter_by(id=chat_id, user_id=user_id).first()
    