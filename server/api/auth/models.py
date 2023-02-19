from datetime import datetime
from flask_login import UserMixin
from flask_jwt_extended import create_access_token, create_refresh_token
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey, Column, Integer, String, DateTime
from api.db import db


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    session = db.session

    notes = relationship("Note", backref="user", lazy=True)

    def generate_token(self, identity):
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)
        return {"access_token": access_token, "refresh_token": refresh_token}

    def __repr__(self):
        return "<User %r>" % self.username
