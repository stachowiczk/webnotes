from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, jsonify, current_app, make_response
from flask_cors import cross_origin
from flask.views import MethodView
from server.api.common.models import Note, SharedNote
from server.api.auth.models import User
from server.api.common import notes_bp
from server.api.common.parser import (
    get_first_sentence as set_title2,
)
from sqlalchemy.exc import IntegrityError


@notes_bp.route("/all", methods=["GET", "POST", "DELETE"])
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
            print(req_data)
            content = req_data["content"]

            title = set_title2(content)
            if not title:
                title = "Untitled"
            elif "<img" in title:
                title = "Image"
            if not content or content == "":
                content = "Untitled note"
            try:
                identity = get_jwt_identity()
            except:
                return jsonify({"message": "Invalid token"}), 401
            note = Note(title=title, content=content, user_id=identity)
            current_app.db.session.add(note)
            current_app.db.session.commit()
            return jsonify({"message": "Note created successfully"}), 201
        except KeyError:
            return jsonify({"message": "Invalid request"}), 400
        except IntegrityError as e:
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
            note.content = req_data["content"]
            note.title = set_title2(note.content)
            if not note.content:
                note.content = ""
            if not note.title:
                note.title = "Untitled"
            elif "<img" in note.title:
                note.title = "Image"
            if not note.content or note.content == "":
                note.content = "Untitled note"
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


@notes_bp.route("/shared", methods=["GET"])
class SharedNotesAPI(MethodView):
    @cross_origin(supports_credentials=True)  # get accepted shared notes
    @jwt_required()
    def get(self):
        try:
            identity = get_jwt_identity()
            session = current_app.db.session
            shared_notes = {}  # {note_id: note}
            shared_notes_list = (
                session.query(SharedNote).filter_by(target_user_id=identity).all()
            )
            for shared_note in shared_notes_list:  # shared_note: SharedNote
                shared_note_get = (
                    session.query(Note).filter_by(id=shared_note.note_id).one()
                )  # shared_note_get: Note
                shared_notes[shared_note_get.id] = shared_note_get.serialize()
                shared_notes[shared_note_get.id]["can_edit"] = shared_note.can_edit
                owner_username = (
                    session.query(User)
                    .filter_by(id=shared_note.owner_id)
                    .one()
                    .username
                )
                shared_notes[shared_note_get.id]["shared_by"] = owner_username
                shared_notes[shared_note_get.id]["status"] = shared_note.status
                shared_notes[shared_note_get.id][
                    "share_id"
                ] = shared_note.id  # share_id is used to delete shared note

            return jsonify(list(shared_notes.values())), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400


@notes_bp.route("/share/<string:note_id>", methods=["POST", "GET", "PUT", "DELETE"])
class ShareAPI(MethodView):
    @cross_origin(supports_credentials=True)
    @jwt_required()
    def post(self, note_id):
        try:
            identity = get_jwt_identity()
            session = current_app.db.session
            note = session.query(Note).filter_by(id=note_id, user_id=identity).one()
            req_data = request.get_json()
            target_user = req_data["target_user"]
            can_edit = req_data["can_edit"]
            target_user = session.query(User).filter_by(username=target_user).one()
            if not target_user:
                target_user = session.query(User).filter_by(username=target_user.lower()) # refactor later
            shared_note = SharedNote(
                note_id=note.id,
                owner_id=identity,
                target_user_id=target_user.id,
                can_edit=can_edit,
            )
            session.add(shared_note)
            session.commit()
            return jsonify({"message": "Note shared successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400

    @cross_origin(supports_credentials=True)
    @jwt_required()
    def put(self, note_id):
        try:
            identity = get_jwt_identity()
            session = current_app.db.session
            shared_note = (
                session.query(SharedNote)
                .filter_by(note_id=note_id, target_user_id=identity)
                .one()
            )
            req_data = request.get_json()
            shared_note.status = req_data["status"]
            session.commit()
            return jsonify({"message": "Note accepted successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400

    @cross_origin(supports_credentials=True)
    @jwt_required()
    def delete(self, note_id):
        try:
            identity = get_jwt_identity()
            session = current_app.db.session
            shared_notes = (
                session.query(SharedNote)
                .filter_by(note_id=note_id, target_user_id=identity)
                .all()
            )
            for shared_note in shared_notes:
                session.delete(shared_note)
            session.commit()
            return jsonify({"message": "Note deleted successfully"}), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400


@notes_bp.route("/share/requests", methods=["GET"])  # get pending requests
class ShareRequestAPI(MethodView):
    @cross_origin(supports_credentials=True)
    @jwt_required()
    def get(self):
        try:
            identity = get_jwt_identity()
            session = current_app.db.session
            shared_notes = (
                session.query(SharedNote)
                .filter_by(target_user_id=identity, status="pending")
                .all()
            )
            shared_notes = [shared_note.note_id for shared_note in shared_notes]
            return jsonify(shared_notes), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Invalid request"}), 400
