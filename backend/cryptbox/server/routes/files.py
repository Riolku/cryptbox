from .utils import wrap_request

import argon2, json, time

from flask import request, Response, g

from cryptbox import app

from cryptbox.database.models.directories import Directories
from cryptbox.database.models.files import Files
from cryptbox.database.models.users import Users

from cryptbox.file_storage import get_file_contents, store_file_contents

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
  return {"status": "ok", "home": g.user.home, "trash": g.user.trash}

def format_dir(d, c = False):
  o = {
    "parent": d.parent,
    "encrypted_name": d.encrypted_name,
    "name_iv": d.name_iv,
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

def format_file(file, c = False, p = False):
  o = {
    "id": file.id,
    "encrypted_name": file.encrypted_name,
    "name_iv": file.name_iv,
    "modified": file.modified,
    "created": file.created,
    "owner": Users.query.filter_by(id = file.owner).first().username
  }
  if c:
    o["encrypted_content"] = get_file_contents(file.id)
  if p:
    d = Directories.query.filter_by(id = file.parent).first()
    o["parent"] = {
      "id": d.id,
      "encrypted_name": d.encrypted_name,
      "name_iv": d.name_iv
    }
  return o

@app.route("/directory/<int:id>", methods = ["GET"])
@wrap_request(False)
@verify_login
def get_directory(id):
  d = Directories.query.filter_by(id = id).first()
  print(d)
  if d is None or d.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  return {"status": "ok", **format_dir(d)}

@app.route("/file/<int:id>", methods = ["GET"])
@wrap_request(False)
@verify_login
def get_file(id):
  f = Files.query.filter_by(id = id).first()
  print(f)
  if f is None or f.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  return {"status": "ok", **format_file(id, True, True)}

@app.route("/directory/<int:id>", methods = ["PATCH"])
@wrap_request()
@verify_login
def modify_directory(id):
  d = Directories.query.filter_by(id = id).first()
  if d is None or d.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  d.encrypted_name = request.json.get("encrypted_name", d.encrypted_name)
  d.parent = request.json.get("parent", d.parent)
  d.modified = int(time.time())
  db.session.commit()
  return {"status": "ok"}

@app.route("/file/<int:id>", methods = ["PATCH"])
@wrap_request()
@verify_login
def modify_file(id):
  f = Files.query.filter_by(id = id).first()
  if f is None or f.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  f.encrypted_name = request.json.get("encrypted_name", f.encrypted_name)
  if "encrypted_content" in request.json:
    store_file_contents(f.id, request.json["encrypted_content"])
  pid = f.parent = request.json.get("parent", f.parent)
  f.modified = int(time.time())
  while True:
    pd = Directories.query.filter_by(id = pid).first()
    pd.modified = int(time.time())
    if pd.parent:
      pid = pd.parent
  db.session.commit()
  return {"status": "ok"}

@app.route("/directory/<int:id>/directory", methods = ["POST"])
@wrap_request()
@verify_login
def create_subdir(id):
  pd = Directories.query.filter_by(id = id).first()
  if pd is None or pd.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  d = Directories(owner = g.user.id, parent = pd.id, encrypted_name = request.json["encrypted_name"], name_iv = request.json["name_iv"])
  db.session.add(d)
  db.session.commit()
  return {"status": "ok", "id": d.id}

@app.route("/directory/<int:id>/file", methods = ["POST"])
@wrap_request()
@verify_login
def create_file(id):
  pd = Directories.query.filter_by(id = id).first()
  if pd is None or pd.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  f = File(owner = g.user.id, parent = pd.id, encrypted_name = request.json["encrypted_name"], name_iv = request.json["name_iv"]) # TODO content
  db.session.add(f)
  db.session.commit()
  return {"status": "ok", "id": f.id}

@app.route("/directory/<int:id>", methods = ["DELETE"])
@wrap_request(False)
@verify_login
def delete_directory(id):
  d = Directories.query.filter_by(id = id).first()
  if d is None or d.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  d.parent = g.user.trash
  db.session.commit()
  return {"status": "ok"}

@app.route("/file/<int:id>", methods = ["DELETE"])
@wrap_request(False)
@verify_login
def delete_file(id):
  f = Files.query.filter_by(id = id).first()
  if f is None or f.owner != g.user.id:
    return {"status": "fail", "error": "forbidden"}
  f.parent = g.user.trash
  db.session.commit()
  return {"status": "ok"}