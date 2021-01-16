from .utils import wrap_request

import argon2, json, time

from flask import request, Response, g

from cryptbox import app

from cryptbox.database.models.users import Users
from cryptbox.jwtutils import verify_jwt

@app.route("/user/dirs", methods = ["GET"])
@wrap_request
def base_dirs():
  token = g.get("cookies", {}).get("token")
  if token is None:
    return {"status": "fail", "error": "login"}
  return {"status": "fail", "error": "notimplemented"}