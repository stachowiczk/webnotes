from flask import request, jsonify, make_response, current_app, redirect
from flask_cors import cross_origin
from flask.views import MethodView
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
    verify_jwt_in_request,
)


from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from server.api.auth.models import User
from server.api.auth import auth_bp


@auth_bp.route("/register", methods=["POST", "GET"])
class RegisterAPI(MethodView):
    def post(self):
        username = request.json["username"]
        password = request.json["password"]
        hashed_password = generate_password_hash(password)
        user = User(username=username, password=hashed_password)
        try:
            existing_user = (
                current_app.db.session.query(User).filter_by(username=username).first()
            )
            if existing_user:
                return jsonify({"message": "User already exists"}), 409
            current_app.db.session.add(user)
            current_app.db.session.commit()
            return jsonify({"message": "User created successfully"}), 201
        except (IntegrityError, KeyError) as e:
            current_app.db.session.rollback()
            return jsonify({"message": "User already exists"}), 409

    ### CHECK IF USERNAME IS AVAILABLE
    ### this is done as the user types in the username in the register form
    def get(self):
        username = request.args.get("username")
        try:
            user = current_app.db.session.query(User).filter_by(username=username).one()
            return jsonify({"message": "User exists"}, 409)
        except NoResultFound:
            return jsonify({"message": "Username available"}), 200


@auth_bp.route("/login", methods=["POST", "GET"])
class LoginAPI(MethodView):
    def post(self):
        try:
            username = request.json["username"]
            password = request.json["password"]
            session = current_app.db.session
            user = session.query(User).filter_by(username=username).one()
            if check_password_hash(user.password, password):
                access_token = user.generate_token(identity=user.id)
                refresh_token = user.generate_refresh_token(identity=user.id)
                response = jsonify({"user": user.username, "user_id": user.id}, 200)
                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)
                return response

            else:
                return make_response(
                    jsonify({"message": "Invalid username or password"}), 401
                )
        except (NoResultFound, KeyError) as e:
            print(e)
            return make_response(
                jsonify({"message": "Invalid username or password"}), 401
            )

    @cross_origin(supports_credentials=True)
    @jwt_required()
    def get(self):
        try:
            identity = get_jwt_identity()
            user = current_app.db.session.query(User).filter_by(id=identity).one()
            return jsonify(str(user)), 200
        except Exception as e:
            print(e)
            return jsonify({"message": "Error getting user info"}), 401


@auth_bp.route("/refresh", methods=["GET"])
class RefreshAPI(MethodView):
    @cross_origin(supports_credentials=True)
    @jwt_required(refresh=True)
    def get(self):
        try:
            identity = get_jwt_identity()
        except:
            return jsonify({"message": "Invalid refresh token"}), 401
        access_token = User.generate_token(self, identity=identity)
        response = make_response(jsonify({"message": "Token refreshed"}), 200)
        set_access_cookies(response, access_token)
        return response

    ### LOGOUT


@auth_bp.route("/logout", methods=["GET"])
class LogoutAPI(MethodView):
    @cross_origin(supports_credentials=True)
    @jwt_required()
    def get(self):
        response = make_response(jsonify({"message": "Logged out"}), 200)
        unset_jwt_cookies(response)
        return response
