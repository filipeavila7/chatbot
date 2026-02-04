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



def get_chat_by_id(chat_id):
    return Chat.query.get(chat_id)


def get_chat_by_id_and_user(chat_id, user_id):
    return Chat.query.filter_by(id=chat_id, user_id=user_id).first()



def delete_chat_by_id_and_user(chat_id, user_id):
    db_chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first()

    if not db_chat:
        return False
    
    db.session.delete(db_chat)
    db.session.commit()
    return db_chat


def gerar_titulo(texto, limite=20):
    texto = texto.strip().split("\n")[0]

    if len(texto) <= limite:
        return texto

    palavras = texto.split(" ")
    titulo = ""

    for palavra in palavras:
        # +1 por causa do espaço
        if len(titulo) + len(palavra) + (1 if titulo else 0) > limite:
            break
        titulo += (" " if titulo else "") + palavra

    return titulo + "..."