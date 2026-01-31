from src import db
from src.models.messages_model import Messages

# função para adcionar nova mensagem no BANCO
def new_message(chat_id, role, content):
    db_message = Messages(
        chat_id = chat_id,
        role = role,
        content = content
    )

    # evitar salvar mensagem vazia
    if not content.strip():
        return None

    db.session.add(db_message)
    db.session.commit()
    return db_message


# listar as ultimas 10 mensagens enviadas pelo usuario
def list_last_messages(chat_id, limit=10):
    return Messages.query.filter_by(chat_id=chat_id)\
        .order_by(Messages.created_at.desc())\
        .limit(limit)\
        .all()[::-1]

# listar todas as mensagens de um chat
def list_messages_by_chat(chat_id):
    return Messages.query.filter_by(chat_id=chat_id)\
        .order_by(Messages.created_at.asc())\
        .all()