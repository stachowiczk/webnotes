from datetime import datetime
from flask_login import UserMixin
from flask_jwt_extended import create_access_token, create_refresh_token
from sqlalchemy.orm import relationship
from api.db import db
from flask import jsonify


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = relationship("Note", backref="user", lazy=True)

    def generate_token(self, identity):
        access_token = create_access_token(identity=identity)
        return access_token

    def generate_refresh_token(self, identity):
        refresh_token = create_refresh_token(identity=identity)
        return refresh_token
    
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "created_at": self.created_at,
            "notes": [note.serialize() for note in self.notes],
        }

    def __repr__(self):
        return "%d%s" % (self.id, self.username)

    def __str__(self):
        return f"{self.username}#{self.id}" # returns username#id
