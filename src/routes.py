from flask import jsonify, request, render_template
from src import app
from src.service.messages_service import new_message, list_last_messages, list_messages_by_chat
from src.service.ai_service import generate_response
from src.service.user_service import create_user, list_user, list_user_email, get_user_by_id
from src.service.chat_service import new_chat, get_chat_by_id, list_chats_by_user, get_chat_by_id_and_user ,delete_chat_by_id_and_user,gerar_titulo
from src import login_manager
from flask_login import login_user, login_required, current_user, logout_user



# rota index, é a rota principal
@app.route("/")
def index():
    return render_template("login.html")

# rota index, é a rota principal
@app.route("/main")
def main():
    return render_template("index.html")

# função de carregar os usuários logados
@login_manager.user_loader
def load_user(user_id):
    return get_user_by_id(int(user_id))


# =================== ROTAS POST ===================

@app.route("/new_user", methods=["POST"])
def new_user():
    # receber e, json
    data = request.get_json()

    #receber nome, email e senha
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    #caso não tenha algum, gera um erro
    if not name or not email or not password:
        return jsonify({
            "error": "name, email e password são obrigatórios"
        }), 400

    #usa a função para criar
    new_user = create_user(name, email, password)

    #retorna um json de sucesso contendo os dados
    return jsonify({
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }), 201


@app.route("/login", methods=["POST"])
def login():
    #receber dados em json
    data = request.get_json()

    #email e senha
    email = data.get("email")
    password = data.get("password")

    # caso não tenha, retorna erro
    if not email or not password:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400

    # listar o usuario pelo email, usando a função ja criada para isso
    user = list_user_email(email)

    # caso o0s dados não correspondam com o do banco
    if not user or user.password != password:
        return jsonify({"error": "Credenciais inválidas"}), 401

    # se corresponder, faz o login do usuario com o flask login
    login_user(user)  

    # retorna umjson de sucesso
    return jsonify({
        "message": "Login realizado com sucesso",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 200



        

@app.route("/chat/send", methods=["POST"])
@login_required
def send_message():
    # variavel data para receber json do front:
    data = request.get_json()

    #receber o id do chat e o contexto da mensagem enviada pelo usuario
    chat_id = data.get("chat_id")
    content = data.get("message")
    
    # caso não tenha id do chat ou contexto, retorna erro
    if not chat_id or not content:
        return jsonify({"error": "o id do chat e o contexto são obrigatorios"}), 400
    
    # verificar se o chat pertence a aquele mesmo usuario
    chat = get_chat_by_id(chat_id)

    if not chat or chat.user_id != current_user.id:
        return jsonify({"error": "Acesso negado"}), 403
    

    # usar a função criada na mesaage_service para criar uma nova mensagem, passando como parametro o contexto que o usuario escreveu
    new_message(chat_id, "user", content)

    # usar a função de listar as ultimas 10 mensagens usando o chat_id como parametro e transformar ela em um objeto json para enviar para a IA
    # a IA usara as 10 mensagens como contexto e respondera a ultima
    db_messages = list_last_messages(chat_id)
    messages = [
        {"role": msg.role, "content": msg.content}
        for msg in db_messages
    ]

    # gerar resposta da IA
    ai_response = generate_response(messages)
    # salvar no banco
    new_message(chat_id, "assistant", ai_response)
    
    return jsonify({"response": ai_response}), 200



@app.route("/chat", methods=["POST"])
@login_required
def create_chat_route():
    """
    Cria um novo chat com o usuário logado, salva a primeira mensagem
    e já gera a primeira resposta da IA.
    """
    # 1️⃣ Receber JSON do front
    data = request.get_json()
    user_id = current_user.id
    first_message = data.get("message")

    # 2️⃣ Validar dados
    if not user_id or not first_message:
        return jsonify({"error": "user_id e message são obrigatórios"}), 400

    # 3️⃣ Gerar título do chat (primeira frase, até 20 caracteres)
    title = gerar_titulo(first_message, 20)

    # 4️⃣ Criar o chat no banco
    chat = new_chat(user_id=user_id, title=title)

    # 5️⃣ Salvar a primeira mensagem do usuário
    new_message(chat_id=chat.id, role="user", content=first_message)

    # 6️⃣ Buscar o contexto para enviar para a IA (neste caso, só a primeira mensagem)
    messages = [{"role": "user", "content": first_message}]

    # 7️⃣ Gerar a resposta da IA
    ai_response = generate_response(messages)

    # 8️⃣ Salvar a resposta da IA no banco
    new_message(chat_id=chat.id, role="assistant", content=ai_response)

    # 9️⃣ Retornar o chat_id, título e a primeira resposta da IA
    return jsonify({
        "chat_id": chat.id,
        "title": chat.title,
        "ai_response": ai_response
    }), 201



#================= ROTAS GET ======================

# listar todos os chats do usuario logado
@app.route("/chats", methods=["GET"])
@login_required
def list_chats_route():
    #usa a fuunção ja criada pra isso, usando o id do usuario logado
    chats = list_chats_by_user(current_user.id)

    # retorna um json de sucesso
    return jsonify([
        {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at
        }
        for chat in chats
    ]), 200


# rota que lista todas as mensagens em um chat especifico, usando oid do chat como parametro
@app.route("/chat/<int:chat_id>/messages", methods=["GET"])
@login_required
def list_messages_route(chat_id):
    # usar a função que lista pelço usuario e o id do chat
    chat = get_chat_by_id_and_user(chat_id, current_user.id)

    # caso não tenha chat, retorna erro
    if not chat:
        return jsonify({"error": "Acesso negado"}), 403

    #listar as mensagens e retronar todas elas em um objeto json de suceso
    messages = list_messages_by_chat(chat_id)

    return jsonify([
        {
            "id": msg.id,
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at
        }
        for msg in messages
    ]), 200


# buscar um chat específico do usuário logado
@app.route("/chat/<int:chat_id>", methods=["GET"])
@login_required
def get_chat_route(chat_id):
    chat = get_chat_by_id_and_user(chat_id, current_user.id)

    if not chat:
        return jsonify({"error": "Acesso negado"}), 403

    return jsonify({
        "id": chat.id,
        "title": chat.title,
        "created_at": chat.created_at
    }), 200


# rota que retorna o atual usuario logado
@app.route("/user/me", methods=["GET"])
@login_required
def user_me():
    return jsonify({
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    })





#===================== ROTAS DELETE =====================

@app.route("/chat/<int:chat_id>", methods =["DELETE"])
@login_required
def delete_chat_route(chat_id):
    sucess = delete_chat_by_id_and_user(chat_id, current_user.id)

    if not sucess:
        return jsonify({"error": "Chat não encontrado ou acesso negado"}), 403
    
    return jsonify({"message": "Chat excluído com sucesso"}), 200