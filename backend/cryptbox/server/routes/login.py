from .utils import wrap_request

import argon2, json

from flask import request, Response, g

from cryptbox import app

from cryptbox.database.models.users import Users
from cryptbox.jwtutils import make_jwt

@app.route("/authenticate", methods = ["POST"])
@wrap_request
def authenticate():
  u = Users.query.filter_by(username = request.json["username"]).first()
  if u is None:
    return {"status": "fail", "error": ""}
  if u.password_hash == argon2.argon2_hash(request.json["password"], u.salt):
    g.setdefault("cookies", {})["token"] = make_jwt(u.id, app.config["SECRET_KEY"])
    return {"status": "ok", "username": u.username}