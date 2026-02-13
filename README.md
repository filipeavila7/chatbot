# ChatBot - Flask Fullstack

## Sobre o Projeto

Aplicação fullstack desenvolvida com Flask, integrando backend, frontend e banco de dados em um único projeto.
A aplicação permite que usuários interajam com um modelo de IA, armazenando histórico de conversas e gerenciando dados via banco relacional.

O sistema utiliza a API do modelo Gemini para geração dinâmica de respostas.

---

## Funcionalidades

* Cadastro de usuários
* Autenticação
* Criação de conversas
* Histórico das conversas no banco de dados
* Integração com API do Gemini
* Interface web integrada ao backend Flask

---

## Tecnologias Utilizadas

* Python
* Flask
* SQLAlchemy
* SQLite
* HTML / CSS / JavaScript
* API Gemini

---

##  Arquitetura

A aplicação segue o padrão MVC simplificado:

- **Models:** Definição das entidades e mapeamento ORM com SQLAlchemy.
- **Routes:** Definição dos endpoints e controle das requisições HTTP.
- **Services:** Camada responsável pelas regras de negócio e integração com serviços externos (API Gemini).
- **Templates:** Renderização do frontend utilizando Jinja.

---

## Como Executar o Projeto

```bash
git clone <url-do-repositorio>
cd nome-do-projeto
pip install -r requirements.txt
flask run
```

A aplicação estará disponível em:

```
http://127.0.0.1:5000
```

---

## Observações

* As chaves da API devem ser configuradas via variável de ambiente.
* Projeto desenvolvido com foco em aprendizado de integração backend + IA.
