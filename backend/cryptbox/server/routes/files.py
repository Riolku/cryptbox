from .utils import wrap_request

import argon2, json, time

from flask import request, Response, g

from cryptbox import app

from cryptbox.database.models.directories import Directories
from cryptbox.database.models.files import Files
from cryptbox.database.models.users import Users
from cryptbox.jwtutils import verify_jwt

def verify_login(f):
  def _inner(*a, **k):
    if g.user is None:
      return {"status": "fail", "error": "login"}
    return f(*a, **k)
  _inner.__name__ = f.__name__
  return _inner

@app.route("/user/dirs", methods = ["GET"])
@wrap_request(False)
@verify_login
def base_dirs():
  return {"status": "okay", "home": g.user.home, "trash": g.user.trash}

def format_dir(d, c = False):
  o = {
    "parent": d.parent,
    "encrypted_name": d.encrypted_name,
    "modified": d.modified,
    "created": d.created,
    "owner": Users.query.filter_by(id = d.owner).first().username
  }
  if c:
    o["children"] = {
      "directories": list(map(format_dir, Directories.query.filter_by(parent = d.id).all())),
      "files": list(map(format_file, Files.query.filter_by(parent = d.id).all()))
    }
  return o

def format_file(file):
  return {
    "id": file.id,
    "encrypted_name": file.encrypted_name,
    "modified": file.modified,
    "created": file.created,
    "owner": Users.query.filter_by(id = file.owner).first().username
  }

@app.route("/directory/<id>", methods = ["GET"])
@wrap_request(False)
@verify_login
def get_directory(id):
  d = Directories.query.filter_by(id = id).first()
  if d is None or d.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  return {"status": "ok", **format_dir(d)}

@app.route("/file/<id>", methods = ["GET"])
@wrap_request(False)
@verify_login
def get_file(id):
  f = Files.query.filter_by(id = id).first()
  if f is None or f.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  return {"status": "ok", **format_file(id)}