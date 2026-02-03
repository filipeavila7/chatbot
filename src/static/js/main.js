

// ================== ESTADO GLOBAL ==================
let currentChatId = null;



// ================== ELEMENTOS ==================
const chatContainer = document.querySelector(".chats-usuario")
const chatBox = document.querySelector(".chat-mensagem");


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
            link.addEventListener("click", (evt) => {
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



// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  carregarChats();
});

