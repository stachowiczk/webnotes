import sys
import pytest
import http.cookies
import unittest
import uuid, json
from datetime import timedelta
from flask.testing import FlaskClient
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
)
from app import create_app
from server.api.db import db as _db
from server.api.auth.models import User
from server.api.common.models import Note
from werkzeug.security import generate_password_hash
from server.config import TestingConfig


@pytest.fixture(scope="module")
def test_app():
    app = create_app(TestingConfig)
    app.config.from_object(TestingConfig)

    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture(scope="module")
def test_client(test_app):
    with test_app.app_context():
        return test_app.test_client()


@pytest.fixture(scope="module")
def test_database(test_app):
    with test_app.app_context():
        _db.create_all()
        yield _db
        _db.drop_all()


@pytest.fixture(scope="function")
def test_user(test_app, test_client, test_database):
    username_uuid = str(uuid.uuid4().hex)
    user = User(
        username=username_uuid, password=generate_password_hash("test_password")
    )
    with test_app.app_context():
        test_database.session.add(user)
        test_database.session.commit()
        yield user


def test_register_user(test_client, test_user, test_database):
    # Send a valid registration request
    response = test_client.post(
        "/auth/register", json={"username": "new_user", "password": "test_password"}
    )
    assert response.status_code == 201
    assert response.json["message"] == "User created successfully"

    # Try to register the same user again
    response = test_client.post(
        "/auth/register", json={"username": "new_user", "password": "test_password"}
    )
    assert response.status_code == 409
    assert response.json["message"] == "User already exists"


def test_check_username(test_client, test_user, test_database):
    response = test_client.get(
        "/auth/register", query_string=({"username": test_user.username})
    )
    assert response.json[0]["message"] == "User exists"

    response = test_client.get(
        "/auth/register", query_string=({"username": test_user.username + "1"})
    )
    assert response.status_code == 200
    assert response.json["message"] == "Username available"


@pytest.mark.usefixtures("test_app", "test_database", "test_user")
def test_login_user(test_client, test_user, test_database):
    # Send a valid login request
    response = test_client.post(
        "/auth/login", json={"username": "new_user", "password": "test_password"}
    )
    assert response.status_code == 200
    # Send a login request for a user that doesn't exist
    response = test_client.post(
        "/auth/login", json={"username": "wrong_user", "password": "wrong_password"}
    )

    assert response.status_code == 401

    # Send a login request with the wrong password
    response = test_client.post(
        "/auth/login", json={"username": "new_user", "password": "wrong_password"}
    )
    assert response.status_code == 401


def test_get_user_info(test_client, test_user, test_database):
    access_token = create_access_token(identity=test_user.id)
    test_client.set_cookie("localhost", "access_token_cookie", access_token)

    response = test_client.get("/auth/login")
    assert response.status_code == 200

    test_client.delete_cookie("localhost", "access_token_cookie")
    expired_token = create_access_token(
        identity=test_user.id + "1", expires_delta=timedelta(seconds=0)
    )
    test_client.set_cookie("localhost", "access_token_cookie", expired_token)

    response = test_client.get("/auth/login")
    assert response.status_code == 401


def test_refresh_token(test_client, test_user, test_database):
    refresh_token = create_refresh_token(identity=test_user.id)
    test_client.set_cookie("localhost", "refresh_token_cookie", refresh_token)

    response = test_client.get(
        "/auth/refresh",
        headers={
            "Access-Control-Allow-Credentials": "true",
        },
    )

    assert response.status_code == 200

    test_client.delete_cookie("localhost", "refresh_token_cookie")

    response = test_client.get("/auth/refresh")
    assert response.status_code == 401


def test_logout_user(test_client, test_user):
    # Make a request to the logout endpoint
    response = test_client.get(
        "/auth/logout", headers={"Access-Control-Allow-Credentials": "true"}
    )

    # Check that the response is successful
    assert response.status_code == 200

    # Check that the access token cookie has been removed

    assert (
        response.headers["Set-Cookie"]
        == "access_token_cookie=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/"
    )


# this is used to login the user before testing endpoints that require authentication
@pytest.mark.usefixtures("test_app", "test_client", "test_database", "test_user")
def login(client, test_user):
    response = client.post(
        "/auth/login",
        data=json.dumps(dict(username=test_user.username, password="test_password")),
        content_type="application/json",
    )
    assert response.status_code == 200
    return response


@pytest.mark.usefixtures("test_app", "test_client", "test_database", "test_user")
def test_notes_api(test_client, test_user):
    # Login the user and get the access token for the test client
    response = login(test_client, test_user)
    set_cookie_header = response.headers.get("Set-Cookie")
    if set_cookie_header:
        cookies = http.cookies.SimpleCookie()
        cookies.load(set_cookie_header)
        jwt_token = cookies.get("access_token_cookie").value
    else:
        jwt_token = None

    # Add a note
    test_data = {
        "content": "test_content",
    }
    response = test_client.post(
        "/notes/",
        data=json.dumps(test_data),
        content_type="application/json",
        headers={"Cookie": f"access_token_cookie={jwt_token};"},
    )
    id = test_user.id
    assert response.status_code == 201

    # Get all notes
    response = test_client.get(
        f"/notes/",
        headers={"Cookie": f"access_token_cookie={jwt_token};"},
    )
    assert response.status_code == 200
    assert response.json[0]["title"] == "test_content"
    assert response.json[0]["content"] == "test_content"
    note_id = response.json[0]["id"]
    notes = Note.query.filter_by(user_id=id).all()
    assert len(notes) == 1

    # Edit a note by id
    test_data_edited = {
        "content": "test_content_edited",
    }

    response = test_client.put(
        f"/notes/{note_id}",
        data=json.dumps(test_data_edited),
        content_type="application/json",
        headers={"Cookie": f"access_token_cookie={jwt_token};"},
    )

    assert response.status_code == 200
    assert len(notes) == 1
    edited_note = Note.query.filter_by(id=note_id).first()
    assert edited_note.title == "test_content_edited"
    assert edited_note.content == "test_content_edited"

    # Delete a note by id
    response = test_client.delete(
        f"/notes/{note_id}",
        headers={"Cookie": f"access_token_cookie={jwt_token};"},
    )
    notes = Note.query.filter_by(user_id=id).all()
    assert response.status_code == 200
    assert len(notes) == 0


def test_share_api(test_client, test_user):
    access_token = create_access_token(identity=test_user.id)
    test_client.set_cookie("localhost", "access_token_cookie", access_token)


if __name__ == "__main__":
    unittest.main()
