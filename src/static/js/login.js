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



function esqueceuSenha(event){
    event.preventDefault(); // caso for um link, ele impede de atualizar a página
    login.style.display = "none";
    esqueceu.style.display = "block";
}


function voltar(event){
    event.preventDefault();
    cadastro.style.display = "none"
    esqueceu.style.display = "none";
    login.style.display = "block";
}


function cadastrar(event){
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



function verSenhaLogin(){
    visivel.style.display = "none"
    escondido.style.display = "inline"
    senhaLogin.type = "text"
}

function esconderSenhaLogin(){
    visivel.style.display = "inline"
    escondido.style.display = "none"
    senhaLogin.type = "password"
}

visivel.addEventListener("click", verSenhaLogin);
escondido.addEventListener("click", esconderSenhaLogin);


function verSenhaCadastro(){
    visivel2.style.display = "none"
    escondido2.style.display = "inline"
    senhaCadastro.type = "text"
}

function esconderSenhaCadastro(){
    visivel2.style.display = "inline"
    escondido2.style.display = "none"
    senhaCadastro.type = "password"
}


visivel2.addEventListener("click", verSenhaCadastro);
escondido2.addEventListener("click", esconderSenhaCadastro);