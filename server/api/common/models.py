from datetime import datetime
import uuid
from sqlalchemy.orm import relationship, backref
from server.api.db import db


class Note(db.Model):
    __tablename__ = "notes"
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # folder_id = db.Column(db.Integer, db.ForeignKey("folders.id"), nullable=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    # shared_users = relationship("User", secondary=shared_notes, backref=backref("shared_notes", cascade="all, delete-orphan"))

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = str(uuid.uuid4().hex)

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


class SharedNote(db.Model):
    __tablename__ = "shared_notes"
    id = db.Column(db.String(36), primary_key=True)
    owner_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    note_id = db.Column(db.String(36), db.ForeignKey("notes.id"), nullable=False)
    target_user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    can_edit = db.Column(db.Boolean, default=False)
    status = db.Column(db.Enum("pending", "accepted", "rejected"), default="pending")
    note = relationship(
        "Note",
        backref=backref("shared_notes", cascade="all, delete-orphan"),
        foreign_keys=[note_id],
    )
    owner = relationship(
        "User",
        backref=backref("owned_shared_notes", cascade="all, delete-orphan"),
        foreign_keys=[owner_id],
    )
    target = relationship(
        "User",
        backref=backref("received_shared_notes", cascade="all, delete-orphan"),
        foreign_keys=[target_user_id],
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = str(uuid.uuid4())

    def __repr__(self):
        return f"SharedNote id: {self.id}, owner_id: {self.owner_id}, note_id: {self.note_id}, target_user_id: {self.target_user_id}, can_edit: {self.can_edit}, status: {self.status}"

    def serialize(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "note_id": self.note_id,
            "target_user_id": self.target_user_id,
            "can_edit": self.can_edit,
            "status": self.status,
        }


# class Folder(db.Model):
# __tablename__ = "folders"
# id = db.Column(db.Integer, primary_key=True)
# name = db.Column(db.String(255), nullable=False)
# if name == "":
# name = "New Folder"
# user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
