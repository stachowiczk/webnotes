from flask import Blueprint

notes_bp = Blueprint("notes", __name__, url_prefix="/notes")

from api.common.views import get_notes, create_note, get_note, update_note, delete_note

notes_bp.add_url_rule("/notes", view_func=get_notes, methods=["GET"])
notes_bp.add_url_rule("/notes", view_func=create_note, methods=["POST"])
from . import views
