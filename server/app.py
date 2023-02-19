from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from api.auth.views import RegisterAPI
from api.auth.views import LoginAPI
from api.common.models import Note
from api.auth.models import User
from api.db import db

app = Flask(__name__)
app.config.from_object('config')
print(app.config['SQLALCHEMY_DATABASE_URI'])
jwt = JWTManager(app)
CORS(app, origins="http://localhost:3000")
db = SQLAlchemy(app)
db.metadata.clear()

with app.app_context():
    target_metadata = [Note.__table__, User.__table__]
    db.metadata.create_all(bind=db.engine, tables=target_metadata)







from api.common.views import notes_bp
from api.auth.views import auth_bp
app.register_blueprint(notes_bp)
app.add_url_rule('/register', view_func=RegisterAPI.as_view('register'))
app.add_url_rule('/login', view_func=LoginAPI.as_view('login'))
app.register_blueprint(auth_bp)

migrate = Migrate(app, db, compare_type=True)



if __name__ == "__main__":
    app.run()
