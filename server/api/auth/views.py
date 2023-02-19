from flask import request, jsonify, make_response
from flask.views import MethodView
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from flask import Blueprint, Response, json
from api.auth.models import User
from api.auth import auth_bp


@auth_bp.route("/register", methods=["POST", "GET"])
class RegisterAPI(MethodView):


    def get(self):
        return jsonify({"message": "User created successfully"}, 201)


    def post(self):
        try:
            print("request received")
            username = request.get_json()["username"]
            password = request.get_json()["password"]
            hashed_password = generate_password_hash(password)
            user = User(username=username, password=hashed_password)
            User.session.add(user)
            User.session.commit()
            return make_response(jsonify({"message": "User created successfully"}, 201))
        except (IntegrityError, KeyError):
            User.session.rollback()
            return make_response(jsonify({"message": "User already exists"}, 409))


@auth_bp.route("/login", methods=["POST"])
class LoginAPI(MethodView):
    def post(self):
        try:
            username = request.json["username"]
            password = request.json["password"]
            user = User.query.filter_by(username=username).one()
            if check_password_hash(user.password, password):
                access_token = user.generate_token(identity=user.id)
                return make_response(jsonify({"message": "Login successful"}, 200))
            else:
                return make_response(
                    jsonify({"message": "Invalid username or password"}, 401)
                )
        except (NoResultFound, KeyError):
            return jsonify({"message": "Invalid username or password"}), 401
