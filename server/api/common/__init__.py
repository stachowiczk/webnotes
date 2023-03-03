from flask import Blueprint

notes_bp = Blueprint("notes", __name__)

from . import views

notes_bp.add_url_rule(
    "/notes/",
    view_func=views.NotesAPI.as_view("notes"),
    methods=["GET", "POST", "DELETE"],
)

notes_bp.add_url_rule(
    "/notes/<string:note_id>",
    view_func=views.NoteAPI.as_view("note"),
    methods=["GET", "PUT", "DELETE"],
)

