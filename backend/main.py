import sys

from cryptbox import app

import cryptbox.server.routes

from flask import request

from flask_cors import CORS
CORS(app)

@app.before_request
def check_login():
  print(request.cookie)

@app.after_request
def add_cors(response):
  response.headers["Access-Control-Allow-Origin"] = "https://cryptbox.kgugeler.ca"
  response.headers["Access-Control-Allow-Headers"] = "content-type"
  response.headers["Access-Control-Allow-Credentials"] = "true"
  return response

@app.errorhandler(500)
def catch_500(e):
  print(e)
  return {"status": "error", "code": 500}

@app.errorhandler(404)
def catch_404(e):
  print(e)
  return {"status": "error", "code": 404}

if __name__ == '__main__':
  debug = "debug" in sys.argv
  app.run(host = '0.0.0.0', port = 5000, debug = debug)
