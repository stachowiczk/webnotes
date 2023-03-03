from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from api.common.models import Note, Folder
from api.auth.models import User
from api.db import db

app = Flask(__name__)
app.config.from_object("config")
jwt = JWTManager(app)
CORS(app, origins="http://localhost:3000", supports_credentials=True)


db = SQLAlchemy(app)
app.db = db
# db.metadata.clear()
with app.app_context():
    target_metadata = [Note.__table__, User.__table__, Folder.__table__]
    db.metadata.create_all(bind=db.engine, tables=target_metadata)

with app.app_context():
    target = [Note, User, Folder]
    app.db.create_all()

from api.common.views import notes_bp
from api.auth.views import auth_bp
from api.auth import views as av
from api.common import views as cv

app.add_url_rule(
    "/notes", view_func=cv.NotesAPI.as_view("notes"), methods=["GET", "POST", "DELETE"]
)

app.add_url_rule(
    "/notes/<string:note_id>",
    view_func=cv.NoteAPI.as_view("note"),
    methods=["GET", "PUT", "DELETE"],
)

app.add_url_rule(
    "/auth/register",
    view_func=av.RegisterAPI.as_view("register"),
    methods=["POST", "GET"],
)
app.add_url_rule(
    "/auth/login",
    view_func=av.LoginAPI.as_view("login"),
    methods=["POST", "GET", "PUT", "DELETE"],
)
app.register_blueprint(notes_bp)
app.register_blueprint(auth_bp)


migrate = Migrate(app, db, compare_type=True)


if __name__ == "__main__":
    app.run(debug=True)
