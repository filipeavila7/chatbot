

// ================== ESTADO GLOBAL ==================
let currentChatId = null;
let userName = "";



// ================== ELEMENTOS ==================
const chatContainer = document.querySelector(".chats-usuario")
const chatBox = document.querySelector(".chat-mensagem");
const bemVindoDiv = document.getElementById("bem-vindo");
const bemVindoTexto = document.getElementById("bem-vindo-texto");


// consumir a api e usar a rota get para listar os chats do usuario

async function carregarChats() {
    try {
        const res = await fetch("http://127.0.0.1:5000/chats")

        // caso de error na resposta, retorna uma mensagem
        if (!res.ok) {
            console.error("Erro ao buscar chats");
            return;
        }

        // declarar uma variaevl que contem os dados retornados da api em json
        const chats = await res.json()

        // ordenar chats por data de criação (mais recentes primeiro)
        chats.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // limpar lista de chats existente
        chatContainer.innerHTML = "";

        // percorrer os dados retornados da api para manipulalos, usando uma chave chat em chats
        chats.forEach(chat => {
            // criar a div onde ficara os links(chats), e colocar uma classe para estilizala
            const divTitulo = document.createElement("div");
            divTitulo.classList.add("titulo");

            // criar os links com o titulo dos dados retornados
            const link = document.createElement("a");
            link.href = "#";

            link.textContent = chat.title

            // anexar o link à div
            divTitulo.appendChild(link);
            // anexar a div ao container
            chatContainer.appendChild(divTitulo);

            // quando clicar no chat, impede que atualize a pagina, e chmama a função que ira abrir o chat
            divTitulo.addEventListener("click", (evt) => {
                evt.preventDefault();
                abrirChat(chat.id);
            });


        });
    } catch (error) {
        console.error("Erro ao carregar chats:", error);
    }

}


// criar função que renderize as mensagens
function renderMensagem(role, content) {
    // criar elemento
    const div = document.createElement("div");


    // caso for user, usa a estilização para ele, caso contrario, gera para a ia
    if (role === "user") {
        div.classList.add("msg-user");
    } else {
        div.classList.add("msg-ia");

    }

    // criar um elemento p para guardar as mensagens
    const p = document.createElement("p");
    // declarae que ele tera o valor vindo do get
    p.textContent = content;

    // adcionar no html
    div.appendChild(p);
    chatBox.appendChild(div);
}




// criar função para abrir os chats
// passa como parametro o id do chat
async function abrirChat(chatid) {
    try {
        // declara que o id do chat escolhido é igual o do parametro
        currentChatId = chatid

        // atualizar mensagem de boas-vindas (esconder)
        atualizarBemVindo();

        //fazer um get na rota das mensagensno chat, colocar o id na rota
        const res = await fetch(`http://127.0.0.1:5000/chat/${chatid}/messages`);

        // verificar se a resposta é ok
        if (!res.ok) {
            console.error("Erro ao buscar mensagens");
            return;
        }

        // declarar uma variavel onde recebe a resposta da api em json
        const messages = await res.json();

        chatBox.innerHTML = ""; // limpa mensagens antigas

        // percorrer os dados com a chave msg, e chamar a função que renderize as mensagens, passando o role e o content da msg
        messages.forEach(msg => {
            renderMensagem(msg.role, msg.content);
        });
        // rolar para baixo automaticamente
        scrollToBottom();
    } catch (error) {
        console.error("Erro ao abrir chat:", error);
    }
}

// função para rolar para baixo
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}


// criar função de novo chat
function novoChat() {
    // remover o chat ativo
    currentChatId = null

    // limpar as mensagens da tela
    chatBox.innerHTML = ""


    //remove destaque do chat selecionado
    document.querySelectorAll(".titulo").forEach(el => {
        el.classList.remove("ativo");
    });

    // atualizar mensagem de boas-vindas
    atualizarBemVindo();

    console.log("Novo chat pronto para iniciar");

}



// adcionar evento para criar novo chat
btnNovo = document.getElementById("novo-chat-btn")

btnNovo.addEventListener("click", novoChat);



// função que carrega o atual usuario logado
async function carregarUsuario() {
    try {
        // faz um get na rota da api
        const res = await fetch("http://127.0.0.1:5000/user/me");
        if (!res.ok) throw new Error("Erro ao buscar usuário");

        // declara a variavel onde ficara o json dos dados recebidos
        const user = await res.json();
        console.log("Usuário logado:", user);

        // pega somnente o nome da resposta
        userName = user.name;

        console.log("Usuário logado:", userName);

        // atualizar mensagem de boas-vindas assim que sabemos o nome
        atualizarBemVindo();

    } catch (err) {
        console.error(err);
    }
}


// função que mostra a mensagem de bem vindo
function atualizarBemVindo() {
    if (currentChatId === null && userName) {
        // Nenhum chat selecionado e usuário carregado → mostrar mensagem
        bemVindoTexto.textContent = `Olá, ${userName}, pergunte alguma coisa.`;
        bemVindoDiv.style.display = "flex"; // usar flex para centralizar conforme CSS
        bemVindoDiv.classList.add("bem-vindo")
    } else {
        // Chat selecionado ou usuário não carregado → esconder mensagem
        bemVindoDiv.style.display = "none";
    }
}


async function enviarMensagem(event) {
    event.preventDefault();

    // ⬇️ ESCONDE O BEM-VINDO IMEDIATAMENTE
    bemVindoDiv.style.display = "none";

    

    const textarea = document.querySelector(".chat-textarea");
    const message = textarea.value.trim();
    if (!message) return;

    try {
        // ================= NOVO CHAT =================
        if (currentChatId === null) {

            // 1️⃣ Renderiza mensagem do usuário
            renderMensagem("user", message);
            scrollToBottom();

            // 2️⃣ Cria o chat já enviando a primeira mensagem
            const res = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message
                })
            });

            if (!res.ok) {
                throw new Error("Erro ao criar chat");
            }

            const data = await res.json();

            // 3️⃣ Salva o id do novo chat
            currentChatId = data.chat_id;

            // 4️⃣ Renderiza resposta da IA
            renderMensagem("assistant", data.ai_response);

            // 5️⃣ Atualiza UI
            carregarChats();
            atualizarBemVindo();

            textarea.value = "";
            scrollToBottom();
            return; // ⛔ não continua para /chat/send
        }

        // ================= CHAT EXISTENTE =================

        // 1️⃣ Renderiza msg do usuário
        renderMensagem("user", message);
        scrollToBottom();

        // 2️⃣ Envia mensagem
        const res = await fetch("http://127.0.0.1:5000/chat/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: currentChatId,
                message: message
            })
        });

        if (!res.ok) {
            throw new Error("Erro ao enviar mensagem");
        }

        const data = await res.json();

        // 3️⃣ Renderiza resposta da IA
        renderMensagem("assistant", data.response);

        textarea.value = "";
        scrollToBottom();

    } catch (err) {
        console.error("Erro ao enviar mensagem:", err);
    }
}



// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
    carregarChats();
    carregarUsuario();

    // Adicionar listener para o form de envio de mensagem
    const chatForm = document.querySelector(".chat-form");
    if (chatForm) {
        chatForm.addEventListener("submit", enviarMensagem);
    }
});


