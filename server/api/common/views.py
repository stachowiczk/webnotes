from flask_login import login_required, current_user
from flask import request, jsonify
from api.common.models import Note
from api.common import notes_bp
from api import db

@notes_bp.route('/', methods=['GET'])
def get_notes():
    try:
        notes = Note.query.filter_by()
        return jsonify([note.serialize for note in notes])
    except:
        return jsonify({'message': 'Invalid request'})

@notes_bp.route('/', methods=['POST'])
def create_note():
    try:
        title = request.json.get['title']
        content = request.json.get['content']
        if not content:
            content = ''
        note = Note(title=title, content=content, user_id=current_user.id)
        db.session.add(note)
        db.session.commit()
        return jsonify({'message': 'Note created successfully'}), 201
    except KeyError:
        return jsonify({'message': 'Invalid request'}), 400

@notes_bp.route('/<int:note_id>', methods=['GET'])
@login_required
def get_note(note_id):
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first()
    if note:
        return jsonify(note.serialize)
    else:
        return jsonify({'message': 'Note not found'}), 404

@notes_bp.route('/<int:note_id>', methods=['PUT'])
@login_required
def update_note(note_id):
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first()
    if note:
        try:
            note.title = request.json['title']
            note.content = request.json.get['content']
            db.session.commit()
            return jsonify({'message': 'Note updated successfully'}), 200
        except KeyError:
            return jsonify({'message': 'Invalid request'}), 400
    else:
        return jsonify({'message': 'Note not found'}), 404

@notes_bp.route('/<int:note_id>', methods=['DELETE'])
@login_required
def delete_note(note_id):
    note = Note.query.filter_by(id=note_id, user_id=current_user.id).first()
    if note:
        db.session.delete(note)
        db.session.commit()
        return jsonify({'message': 'Note deleted successfully'}), 200
    else:
        return jsonify({'message': 'Note not found'}), 404




