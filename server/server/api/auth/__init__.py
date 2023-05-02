from flask import Blueprint

auth_bp = Blueprint("auth", __name__)

from . import views

auth_bp.add_url_rule(
    "/api/auth/register",
    view_func=views.RegisterAPI.as_view("register"),
    methods=["POST", "GET"],
)
auth_bp.add_url_rule(
    "/api/auth/login",
    view_func=views.LoginAPI.as_view("login"),
    methods=["POST", "GET"],
)

auth_bp.add_url_rule(
    "/api/auth/logout",
    view_func=views.LogoutAPI.as_view("logout"),
    methods=["GET"],
)

auth_bp.add_url_rule(
    "/api/auth/refresh",
    view_func=views.RefreshAPI.as_view("refresh"),
    methods=["GET"],
)
