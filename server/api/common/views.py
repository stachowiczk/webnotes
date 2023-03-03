from flask_login import login_required, current_user
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, jsonify, current_app, Response, make_response
from flask_cors import cross_origin
from flask.views import MethodView
from api.common.models import Note
from api.common import notes_bp


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
            title = req_data["title"]
            content = req_data["content"]
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
