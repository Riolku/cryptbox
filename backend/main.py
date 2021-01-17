import sys, traceback

from cryptbox import app

from cryptbox.database.models.users import Users

import cryptbox.server.routes

from cryptbox.jwtutils import verify_jwt

from flask import g, request

from flask_cors import CORS
CORS(app)

@app.before_request
def check_login():
  g.user = None
  g.token = None
  token = request.cookies.get("token")
  if token is not None:
    try:
      obj = verify_jwt(token, app.secret_key)
      user = Users.query.filter_by(id = obj["uid"]).first()
      if user:
        g.user = user
        g.token = token
    except:
      pass

@app.after_request
def add_cookie(response):
  if g.user:
    response.set_cookie("token", g.token, samesite = "None", secure = True)
  return response

@app.after_request
def add_cors(response):
  response.headers["Access-Control-Allow-Origin"] = request.environ.get("HTTP_ORIGIN") or ""
  response.headers["Access-Control-Allow-Headers"] = "content-type"
  response.headers["Access-Control-Allow-Credentials"] = "true"
  response.headers['Access-Control-Allow-Methods'] = "HEAD, OPTIONS, GET, POST, DELETE, PATCH, PUT"
  return response

@app.errorhandler(500)
def catch_500(e):
  print(e)
  return {"status": "error", "code": 500}

@app.errorhandler(404)
def catch_404(e):
  print(e)
  return {"status": "error", "code": 404}

@app.errorhandler(Exception)
def catch_error(e):
  print(e)
  return {"status": "error", "code": 500, "details": str(e)}

if __name__ == '__main__':
  debug = "debug" in sys.argv
  app.run(host = '0.0.0.0', port = 5000, debug = debug)
