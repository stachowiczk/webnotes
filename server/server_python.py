"""
this will contain the api endpoints for the server

"""
from flask import Flask, request, jsonify, url_for
from functools import wraps
from jose import jwt
import bcrypt
import os
from datetime import datetime, timedelta

from flask_cors import CORS, cross_origin
from dbase_handler import DatabaseHandler as db
from sqlite3 import connect as sqlite_connect
from sqlalchemy import create_engine, sql

# create a new database if the database doesn't already exist

app = Flask(__name__)
app.testing = True

AUTH0_DOMAIN = "dev-1x1x1x1x.us.auth0.com"

CORS(app, origins="http://localhost:3000")

# wrap functions with this decorator to require authentication
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if token:
            try:
                payload = jwt.decode(
                    token, os.environ["AUTH0_CLIENT_SECRET"], algorithms="HS256"
                )
            except jwt.ExpiredSignatureError:
                return "Token expired", 401
            except jwt.JWTClaimsError:
                return "Invalid claims", 401
            except Exception:
                return "Invalid header", 401
            return f(*args, **kwargs)
        else:
            return "Authorization header is expected", 401

    return decorated


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


@app.route("/auth/login", methods=["POST"])
def login():
    req_data = request.get_json()
    username = req_data["username"]
    email = req_data["email"]
    password = req_data["password"]

    try:
        user = get_user(username)
    except:
        return "Invalid username or password", 404
    if user:
        if check_password(password, user["password"]):
            token = create_token(user)
            return jsonify(token=token)
        else:
            return "Invalid username or password", 404
    else:
        return "Invalid username or password", 404


def get_user(username):
    session = db()
    user_data = session.find_user(username)
    return user_data


def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_token(user):
    payload = {
        "sub": user["id"],
        "name": user["username"],
        "email": user["email"],
        "iat": datetime.now(),
        "exp": datetime.now() + timedelta(days=1),
    }
    token = jwt.encode(payload, os.environ["AUTH0_CLIENT_SECRET"], algorithm="HS256")
    return token
    # returns a signed token
    # the @requires_auth decorator will decode the token and validate it


@app.route("/auth/register", methods=["POST"])
def register():
    req_data = request.get_json()
    username = req_data["username"]
    email = req_data["email"]
    password = req_data["password"]

    session = db()
    user_data = session.find_user(username)
    if user_data:
        return "User already exists", 409
    else:
        hashed_password = hash_password(password)
        session.insert_user(username, email, hashed_password)
        return "User created", 200


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


@app.route("/api/submit", methods=["POST"])
# @requires_auth
def submit():

    session = db()
    title = request.json["title"]
    content = request.json["content"]

    insertedId = session.insert(title, content)
    return jsonify(insertedId)


def test_submit():
    client = app.test_client()
    request = client.post(
        "/api/submit", data={"title": "test title", "content": "test content"}
    )
    assert request.status_code == 200

    session = db()
    insertedId = session.insert("test title", "test content")
    assert insertedId == 1


@app.route("/api/search", methods=["GET"])
def find():
    session = db()
    db_find = session.findAll()
    response = jsonify(db_find)
    return response
    # TODO: add search query handling

    if db_find:
        response = jsonify(db_find)
        return response
    else:
        return "No results found"


@app.route("/api/drop", methods=["GET"])
def drop():
    session = db()
    session.dropTable()
    return "success"


def test_drop():
    session = db()
    session.dropTable()
    assert True


if __name__ == "__main__":
    app.run(port=5000, debug=True)
