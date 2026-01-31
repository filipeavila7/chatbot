from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager


app = Flask(__name__)
app.config.from_object("connection")
db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.secret_key = "secreto"

login_manager = LoginManager(app)
login_manager.login_view = 'login'  # nome da rota da página de login




from src.models import user_model, chats_model, messages_model
from src import routes
