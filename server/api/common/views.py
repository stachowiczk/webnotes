from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, jsonify, current_app, make_response
from flask_cors import cross_origin
from flask.views import MethodView
from api.common.models import Note
from api.common import notes_bp
import re


@notes_bp.route("/", methods=["GET", "POST", "DELETE"])
class NotesAPI(MethodView):
    @cross_origin(supports_credentials=True)
    @jwt_required()
    def get(self):
        try:
            session = current_app.db.session

            identity = get_jwt_identity()
            notes = session.query(Note).filter_by(user_id=identity).all()
            notes = [note.serialize() for note in notes]
            if notes.__len__ == 0:
                response = make_response(jsonify({"message": "No notes found"}), 404)
                return response
            else:
                return jsonify(notes), 200

        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400

    @cross_origin(supports_credentials=True)
    @jwt_required()
    def post(self):
        try:
            req_data = request.get_json()
            content = req_data["content"]
            title = NotesAPI.set_title(content)
            identity = get_jwt_identity()
            if not content:
                content = ""
            note = Note(title=title, content=content, user_id=identity)
            current_app.db.session.add(note)
            current_app.db.session.commit()
            return jsonify({"message": "Note created successfully"}), 201
        except KeyError:
            return jsonify({"message": "Invalid request"}), 400
        except Exception as e:
            print(e)
            return jsonify({"message": "required title"}), 400

    @cross_origin(supports_credentials=True)
    @jwt_required()
    def delete(self):
        try:
            identity = get_jwt_identity()
            session = current_app.db.session
            session.query(Note).filter_by(user_id=identity).delete()
            session.commit()
            return jsonify({"message": "All notes deleted successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400

    def set_title(content):
        first_50 = content[:30]
        next_space = content[30:].find(" ")
        if next_space == -1:
            return first_50
        else:
            title_line = content[: 30 + next_space]
            stripped_title = re.sub(r"[^/w/s]+$", "", title_line)
        return stripped_title
    
    def set_title2(content):
        pass
    # TODO



@notes_bp.route("/<string:note_id>", methods=["GET", "PUT", "DELETE"])
class NoteAPI(MethodView):
    @cross_origin(supports_credentials=True)
    @jwt_required()
    def get(self, note_id):
        try:
            identity = get_jwt_identity()
            session = current_app.db.session
            note = session.query(Note).filter_by(id=note_id, user_id=identity).one()
            return jsonify(note.serialize()), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400

    @cross_origin(supports_credentials=True)
    @jwt_required()
    def put(self, note_id):
        try:
            identity = get_jwt_identity()
            session = current_app.db.session
            note = session.query(Note).filter_by(id=note_id, user_id=identity).one()
            req_data = request.get_json()
            note.title = req_data["title"]
            note.content = req_data["content"]
            session.commit()
            return jsonify({"message": "Note updated successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400

    @cross_origin(supports_credentials=True)
    @jwt_required()
    def delete(self, note_id):
        try:
            identity = get_jwt_identity()
            session = current_app.db.session
            note = session.query(Note).filter_by(id=note_id, user_id=identity).one()
            session.delete(note)
            session.commit()
            return jsonify({"message": "Note deleted successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400

@notes_bp.route("/share/<string:note_id>", methods=["POST", "GET", "DELETE"])
class ShareAPI(MethodView):
    pass
