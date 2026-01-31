from src.models.user_model import User
from src import db

def create_user(name, email, password):
    db_user = User(
        name = name,
        email = email,
        password = password
    )
    db.session.add(db_user)
    db.session.commit()
    return db_user


def list_user():
    db_user = User.query.all
    return db_user

def get_user_by_id(user_id):
    return User.query.get(user_id)

def list_user_email(email):
    db_user = User.query.filter_by(email=email).first()
    return db_user

def delete_user(email):
    db_user = User.query.filter_by(email=email).first()
    db.session.delete(db_user)
    db.session.commit()
    return db_user



def update_user(email, name=None, password=None, new_email=None):
    db_user = User.query.filter_by(email=email).first()

    if not db_user:
        return None

    if name is not None:
        db_user.name = name

    if password is not None:
        db_user.password = password

    if new_email is not None:
        db_user.email = new_email

    db.session.commit()
    return db_user
