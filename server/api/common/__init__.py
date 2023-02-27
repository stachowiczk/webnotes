from flask import Blueprint

notes_bp = Blueprint("notes", __name__)

from . import views

notes_bp.add_url_rule(
    "/notes/",
    view_func=views.NotesAPI.as_view("notes"),
    methods=["GET", "POST", "DELETE"],
)
