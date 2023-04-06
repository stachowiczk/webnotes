import sys
import pytest
import jwt
import http.cookies
import unittest
import uuid, json
from datetime import timedelta
from flask.testing import FlaskClient
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    JWTManager,
    get_jwt_identity,
    jwt_required,
)
from app import create_app
from server.api.db import db as _db
from server.api.auth.models import User
from server.api.common.models import Note
from werkzeug.security import generate_password_hash
from werkzeug.http import parse_cookie
from server.config import TestingConfig


@pytest.fixture(scope="module")
def test_app():
    app = create_app(TestingConfig)
    app.config.from_object(TestingConfig)
    manager = JWTManager(app)

    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture(scope="module")
def test_client(test_app):
    with test_app.app_context():
        print("Creating test client")
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
        print("Creating user")
        yield user

        print("Deleting user")


def test_register_user(test_client, test_user, test_database):
    # Send a valid registration request
    response = test_client.post(
        "/auth/register", json={"username": "new_user", "password": "test_password"}
    )

    # Expect a 201 status code indicating success
    assert response.status_code == 201
    assert response.json["message"] == "User created successfully"

    # Send an invalid registration request with a duplicate username
    response = test_client.post(
        "/auth/register", json={"username": "new_user", "password": "test_password"}
    )

    # Expect a 409 status code indicating that the user already exists
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
    response = test_client.post(
        "/auth/login", json={"username": "new_user", "password": "test_password"}
    )
    assert response.status_code == 200

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
def test_add_note(test_client, test_user):
    response = login(test_client, test_user)
    set_cookie_header = response.headers.get("Set-Cookie")
    if set_cookie_header:
        cookies = http.cookies.SimpleCookie()
        cookies.load(set_cookie_header)
        jwt_token = cookies.get("access_token_cookie").value

    test_data = {
        "title": "test_title",
        "content": "test_content",
    }
    response = test_client.post(
        "/notes/",
        data=json.dumps(test_data),
        content_type="application/json",
        headers={"Cookie": f"access_token_cookie={jwt_token};"},
    )
    id = test_user.id
    
    print(id)
    assert response.status_code == 201


if __name__ == "__main__":
    unittest.main()
