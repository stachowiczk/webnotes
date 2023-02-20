from flask import request, jsonify, make_response, current_app
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
        username = request.json["username"]
        password = request.json["password"]
        hashed_password = generate_password_hash(password)
        user = User(username=username, password=hashed_password)
        try:
            current_app.db.session.add(user)
            current_app.db.session.commit()
            return jsonify({"message": "User created successfully"}, 201)
        except (IntegrityError, KeyError) as e:
            User.session.rollback()
            return make_response(jsonify({"message": "User already exists"}, 409))


@auth_bp.route("/login", methods=["POST"])
class LoginAPI(MethodView):
    def post(self):
        try:
            username = request.json["username"]
            password = request.json["password"]
            session = current_app.db.session
            user = session.query(User).filter_by(username=username).one()
            if check_password_hash(user.password, password):
                access_token = user.generate_token(identity=user.id)
                return jsonify ({"message": "Login successful", "accessToken": access_token}), 200
            else:
                return make_response(
                    jsonify({"message": "Invalid username or password"}, 401)
                )
        except (NoResultFound, KeyError) as e:
            print(e)
            return jsonify({"message": "Invalid username or password keyerror"}), 401
