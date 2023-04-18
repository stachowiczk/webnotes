from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from server.api.common.models import Note, SharedNote
from server.api.auth.models import User
from server.api.db import db
from server.config import Config as cfg


def create_app(config_name=None):
    app = Flask(__name__)
    if config_name:
        app.config.from_object(config_name)
    else:
        app.config.from_object("server.config.Config")
    jwt = JWTManager(app)
    CORS(app, origins=cfg.CORS_ORIGINS, supports_credentials=True)
    db.init_app(app)
    app.db = db
    
    from server.api.common.views import notes_bp
    from server.api.auth.views import auth_bp

    app.register_blueprint(notes_bp)
    app.register_blueprint(auth_bp)

    migrate = Migrate(app, db, compare_type=True)

    return app


app = create_app()


if __name__ == "__main__":
    with app.app_context():
        target = [Note, User, SharedNote]  
        engine = app.db.engine
        app.db.create_all()
    app.run()
