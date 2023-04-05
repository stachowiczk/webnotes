from datetime import datetime, timedelta
from flask_login import UserMixin
from flask_jwt_extended import create_access_token, create_refresh_token
from sqlalchemy.orm import relationship
from server.api.db import db
import uuid
from flask import jsonify


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(36), primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = relationship("Note", backref="user", lazy=True)
    #shared_notes = relationship("SharedNote", secondary="shared_notes", backref="shared_with")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = str(uuid.uuid4().hex)
        self.id = self.id[:12]

    def generate_token(self, identity):
        access_token = create_access_token(identity=identity)
        return access_token

    def generate_refresh_token(self, identity):
        refresh_token = create_refresh_token(identity=identity, expires_delta=timedelta(days=30))
        return refresh_token

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "created_at": self.created_at,
            "notes": [note.serialize() for note in self.notes],
        }

    def share_note_with(self, note, user):
        if note.user_is == self.id:
            note.shared_with.append(user)
            db.session.commit()
            return True
        return False


    def __repr__(self):
        return "%d%s" % (self.id, self.username)

    def __str__(self):
        return f"{self.username}"  # returns username#id
