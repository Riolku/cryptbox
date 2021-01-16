from .utils import wrap_request

from cryptbox import app

@app.route("/user", methods = ["POST"])
@wrap_request
def signup():
    pass
