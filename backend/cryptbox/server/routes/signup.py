from flask import request

from cryptbox import app

@app.route("/user", methods = ["POST"])
def signup():
