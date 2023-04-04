import sys
import unittest
import uuid, json
import pytest
from flask.testing import FlaskClient
from flask_jwt_extended import create_access_token, create_refresh_token
from app import create_app
from server.api.db import db as _db
from server.api.auth.models import User
from werkzeug.security import generate_password_hash
from server.config import TestingConfig


@pytest.fixture(scope='module')
def test_app():
    app = create_app(TestingConfig)
    app.config.from_object('server.config.TestingConfig')
    
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()

@pytest.fixture(scope='module')
def test_client(test_app):
    with test_app.app_context():
        return test_app.test_client()

@pytest.fixture(scope='module')
def test_database(test_app):
    with test_app.app_context():
        _db.create_all()
        yield _db
        _db.drop_all()

@pytest.fixture(scope='function')
def test_user(test_app, test_database):
    username_uuid = str(uuid.uuid4().hex)
    user = User(username=username_uuid, password=generate_password_hash('test_password'))
    with test_app.app_context():
        test_database.session.add(user)
        test_database.session.commit()
        print('Creating user')
        yield user
        test_database.session.delete(user)
        test_database.session.commit()
        print('Deleting user')


def test_register_user(test_client, test_user, test_database):
    # Send a valid registration request
    response = test_client.post('/auth/register', json={
        'username': 'new_user',
        'password': 'test_password'
    })

    # Expect a 201 status code indicating success
    assert response.status_code == 201
    assert response.json['message'] == 'User created successfully'

    # Send an invalid registration request with a duplicate username
    response = test_client.post('/auth/register', json={
        'username': 'new_user',
        'password': 'test_password'
    })

    # Expect a 409 status code indicating that the user already exists
    assert response.status_code == 409
    assert response.json['message'] == 'User already exists'

def test_check_username(test_client, test_user, test_database):
    response = test_client.get('/auth/register', query_string=(
        {
            'username': test_user.username
        }

    ))
    assert response.status_code == 409
    assert response.json['message'] == 'User exists'

    response = test_client.get('/auth/register', query_string=(
        {
            'username': test_user.username + '1'
        }
    ))
    assert response.status_code == 200
    assert response.json['message'] == 'Username available'

@pytest.mark.usefixtures('test_app', 'test_database', 'test_user')
def test_login_user(test_client, test_user, test_database):
    response = test_client.post('/auth/login', json={
        'username': 'new_user',
        'password': 'test_password'
    })
    assert response.status_code == 200

    response = test_client.post('/auth/login', json={
        'username': 'new_user',
        'password': 'wrong_password'
    })
    assert response.status_code == 401
    


    

def test_get_user_info(test_client, test_user, test_database):
    access_token = create_access_token(identity=test_user.id)
    response = test_client.get('/auth/login', headers={
        'Cookie': f'access_token_cookie={access_token}'})
    assert response.status_code == 200

    invalid_token = 'invalid_token'
    response = test_client.get('/auth/login', headers={
        'Cookie': f'access_token_cookie={invalid_token}'})
    assert response.status_code == 401

def test_token_refresh(test_client, test_user, test_database):
    def test_my_test(test_client, test_database):
        print("**** DATABASE STATE BEFORE TEST ****")
        print(list(test_database.session.execute('SELECT * FROM users')))
    test_my_test(test_client, test_database)
    refresh_token = create_refresh_token(identity=test_user.id)
    response = test_client.get('/auth/refresh', headers={
        'Authorization': f'Bearer {refresh_token}',
        'Access-Control-Allow-Credentials': 'true'
    })
   
    assert response.status_code == 200
    assert response.json['message'] == 'Token refreshed'

    invalid_token = 'invalid_token'
    response = test_client.get('/auth/refresh', headers={
        'Authorization': f'Bearer {invalid_token}',
        'Access-Control-Allow-Credentials': 'true'
    })

    
    assert response.status_code == 401



def test_logout_user(test_client, test_user):
    # Make a request to the logout endpoint
    response = test_client.get('/auth/logout', headers={
        'Access-Control-Allow-Credentials': 'true'})
    

    # Check that the response is successful
    assert response.status_code == 200

    # Check that the access token cookie has been removed





if __name__ == '__main__':
    unittest.main()

    
