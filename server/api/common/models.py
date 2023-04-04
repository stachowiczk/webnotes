from datetime import datetime
import uuid
from sqlalchemy.orm import relationship
from server.api.db import db

# shared_notes = db.Table(
    # "shared_notes",
    # db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    # db.Column("note_id", db.String(36), db.ForeignKey("notes.id"), primary_key=True),
# )

class Note(db.Model):
    __tablename__ = "notes"
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # folder_id = db.Column(db.Integer, db.ForeignKey("folders.id"), nullable=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    #shared_users = relationship("User", secondary=shared_notes, backref="shared_notes")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = str(uuid.uuid4())

    def __repr__(self):
        return f"Note id: {self.id}, title: {self.title}"

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "created_at": self.created_at,
            "user_id": self.user_id,
        }

# class Folder(db.Model):
    # __tablename__ = "folders"
    # id = db.Column(db.Integer, primary_key=True)
    # name = db.Column(db.String(255), nullable=False)
    # if name == "":
        # name = "New Folder"
    # user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
