from flask import request

from cryptbox import app

from cryptbox.database.models.users import Users

@app.route("/authenticate", methods = ["POST"])
def authenticate():
  return "sure"