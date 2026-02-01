const login = document.getElementById("containerLogin");
const cadastro = document.getElementById("containerCadastro");
const esqueceu = document.getElementById("containerEsqueceu");
const linkEsqueceu = document.getElementById("linkEsqueceu");
const linkCadastro = document.getElementById("linkCadastro");
const linkVoltarEsqueceu = document.getElementById("linkVoltarEsqueceu");
const linkVoltarCadastro = document.getElementById("linkVoltarCadastro");
const visivel = document.getElementById("visivel");
const visivel2 = document.getElementById("visivel2");
const escondido = document.getElementById("escondido");
const escondido2 = document.getElementById("escondido2");
const senhaLogin = document.getElementById("senha");
const senhaCadastro = document.getElementById("senha-cadastro");



function esqueceuSenha(event) {
    event.preventDefault(); // caso for um link, ele impede de atualizar a página
    login.style.display = "none";
    esqueceu.style.display = "block";
}


function voltar(event) {
    event.preventDefault();
    cadastro.style.display = "none"
    esqueceu.style.display = "none";
    login.style.display = "block";
}


function cadastrar(event) {
    event.preventDefault();
    login.style.display = "none";
    cadastro.style.display = "block";
}


// evento de voltar
linkVoltarEsqueceu.addEventListener("click", voltar);
linkVoltarCadastro.addEventListener("click", voltar);

// evento de chamar modais
linkEsqueceu.addEventListener("click", esqueceuSenha);
linkCadastro.addEventListener("click", cadastrar);



function verSenhaLogin() {
    visivel.style.display = "none"
    escondido.style.display = "inline"
    senhaLogin.type = "text"
}

function esconderSenhaLogin() {
    visivel.style.display = "inline"
    escondido.style.display = "none"
    senhaLogin.type = "password"
}

visivel.addEventListener("click", verSenhaLogin);
escondido.addEventListener("click", esconderSenhaLogin);


function verSenhaCadastro() {
    visivel2.style.display = "none"
    escondido2.style.display = "inline"
    senhaCadastro.type = "text"
}

function esconderSenhaCadastro() {
    visivel2.style.display = "inline"
    escondido2.style.display = "none"
    senhaCadastro.type = "password"
}


visivel2.addEventListener("click", verSenhaCadastro);
escondido2.addEventListener("click", esconderSenhaCadastro);


//logica de login

// variavel do formulario de login
const form = document.querySelector("#LoginForm");

//impedir que a pagina recarregue quando clicar no botao de submit
// colocar toda a função do fetch nessse evento assincrono
form.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    // declarar as variáveis de email e senha

    const email = document.querySelector("#email")
    const senha = document.querySelector("#senha")

    // consumir a api

    try {
        // fetch para fazer uma requisição http para a api
        // como o fetch é assincrono, precisamos do await para esperar a resposta do servidor
        const response = await fetch("http://127.0.0.1:5000/login", {
            // metodo post para enviar dados para a api 
            method: "POST",
            // definir que os dados que vão chegar para a api são em formato json
            headers: {
                "Content-Type": "application/json"
            },
            // muito importante: faz o navegador enviar cookies, salvar cookies e manter a sessão, funcionando o current user do flask login
            credentials: "include",
            // corpo da requisição post, trnasformando os dados em json
            body: JSON.stringify({
                email: email.value,
                password: senha.value
            })
        })

        // data para pegar a resposta que o back retornou e trnasformar em um objeto js
        // data sera o conteudo da api
        const data = await response.json()

        // verificar a resposta, o que retornou etc
        if (!response.ok) {
            const messageDiv = document.getElementById("messageLogin");
            messageDiv.textContent = data.message || "Erro ao fazer login. Verifique suas credenciais.";
            messageDiv.className = "message error show";
            messageDiv.style.display = "block";
            setTimeout(() => {
                messageDiv.classList.remove("show");
                setTimeout(() => {
                    messageDiv.style.display = "none";
                }, 300);
            }, 800);
            return;
        }

        // caso não tenha nenhum erro, mostra mensagem de sucesso
        const messageDiv = document.getElementById("messageLogin");
        messageDiv.textContent = "Login realizado com sucesso!";
        messageDiv.className = "message success show";
        messageDiv.style.display = "block";

        console.log("usuario logado:", data.user);

        // redirecionar para outra pagina após mostrar a mensagem
        setTimeout(() => {
            messageDiv.classList.remove("show");
            setTimeout(() => {
                messageDiv.style.display = "none";
                window.location.href = "/main";
            }, 300);
        }, 800);


        //catch para capturar erros e printar no console
    } catch (error) {
        console.error(error)
    }
})


// logica de cadastro de usuario
const formCadastro = document.querySelector("#CadastroForm")


formCadastro.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    const name = document.querySelector("#nome")
    const newEmail = document.querySelector("#email-cadastro")
    const newPassword = document.querySelector("#senha-cadastro")


    try{
        const response = await fetch("http://127.0.0.1:5000/new_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                name: name.value,
                email: newEmail.value,
                password: newPassword.value
            })
        })
        
        const data = await response.json()

        // verificar a resposta, o que retornou etc
        if (!response.ok) {
            console.log("erro ao cadastrar")
            return;
        }

        console.log("cadastro realizado com sucesso");

        console.log("usuario cadastrado:", data.user);

        window.location.href = "/";


        
    }
    catch (error) {
        console.error(error)}
})
    

