# pylint: disable=C0103,C0111

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy, orm
from flask.ext.login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask("led-movie-visualization")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)

class SessionMixin(object):
    def save(self):
        self.updated_at = datetime.now()
        db.session.add(self)
        db.session.commit()
        return self

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class User(SessionMixin, UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(255), nullable=False, unique=True)
    password = orm.deferred(db.Column(db.String(255), nullable=False))
    avatar_image = db.Column(db.String(255))
    active = db.Column(db.Boolean(), nullable=False, default=True)
    created_at = db.Column(db.DateTime(), nullable=False)
    updated_at = db.Column(db.DateTime(), nullable=False)

    def __init__(self, login, password):
        self.login = login
        self.password = generate_password_hash(password)
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def __repr__(self):
        return '<User %r>' % self.id

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def is_active(self):
        return self.active
