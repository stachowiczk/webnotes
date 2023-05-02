from flask import Blueprint

notes_bp = Blueprint("notes", __name__)

from . import views

notes_bp.add_url_rule(
    "/api/notes/all",
    view_func=views.NotesAPI.as_view("notes"),
    methods=["GET", "POST", "DELETE"],
)

notes_bp.add_url_rule(
    "/api/notes/<string:note_id>",
    view_func=views.NoteAPI.as_view("note"),
    methods=["GET", "PUT", "DELETE"],
)

notes_bp.add_url_rule(
    "/api/notes/share/<string:note_id>",
    view_func=views.ShareAPI.as_view("share"),
    methods=["POST", "GET", "DELETE"],
)

notes_bp.add_url_rule(
    "/api/notes/shared",
    view_func=views.SharedNotesAPI.as_view("shared_notes"),
    methods=["GET"],
)

notes_bp.add_url_rule(
    "/api/notes/share/requests",
    view_func=views.ShareRequestAPI.as_view("share_requests"),
    methods=["GET"],
)
