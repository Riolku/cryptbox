from .utils import wrap_request

import argon2, json, os, time

from flask import request, Response, g

from cryptbox import app

from cryptbox.database import db
from cryptbox.database.models.directories import Directories
from cryptbox.database.models.users import Users
from cryptbox.jwtutils import make_jwt

@app.route("/register", methods = ["POST"])
@wrap_request()
def register():
  username = request.json["username"]
  password = request.json["password"]
  if Users.query.filter_by(username = username).count() > 0:
    return {"status": "fail", "error": "username_taken"}
  if set(username) - set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_."):
    return {"status": "fail", "error": "username_invalid"}
  salt = os.urandom(16)
  u = Users(username = username, password_hash = argon2.argon2_hash(password, salt), salt = salt)
  db.session.add(u)
  db.session.commit()
  tm = int(time.time())
  h = Directories(owner = u.id, encrypted_name = request.json["home" ]["encrypted_name"], name_iv = request.json["home" ]["iv"], created = tm, modified = tm)
  t = Directories(owner = u.id, encrypted_name = request.json["trash"]["encrypted_name"], name_iv = request.json["trash"]["iv"], created = tm, modified = tm)
  db.session.add(h)
  db.session.add(t)
  db.session.commit()
  u.home = h.id
  u.trash = t.id
  db.session.add(u)
  db.session.commit()
  g.user = u
  g.token = make_jwt({"uid": u.id, "at": int(time.time()), "exp": int(time.time()) + 604800}, app.config["SECRET_KEY"])
  return {"status": "ok", "username": u.username}