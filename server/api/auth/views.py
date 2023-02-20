from flask import request, jsonify, make_response, current_app, redirect
from flask.views import MethodView
from flask_jwt_extended import set_access_cookies, set_refresh_cookies, unset_jwt_cookies
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from api.auth.models import User
from api.auth import auth_bp



@auth_bp.route("/register", methods=["POST"])
class RegisterAPI(MethodView):
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
            current_app.db.session.rollback()
            return jsonify({"message": "User already exists"}, 409)



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
                print(user.id)
                response = make_response("Logged in successfully", 200)
                set_access_cookies(response, access_token)
                print("cookies set")
                return response

            else:
                return make_response(
                    jsonify({"message": "Invalid username or password"}, 401)
                )
        except (NoResultFound, KeyError) as e:
            print(e)
            return jsonify({"message": "Invalid username or password keyerror"}), 401
