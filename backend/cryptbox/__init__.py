from flask import Flask

app = Flask('cryptbox')

from cryptbox.config import configure_app

configure_app(app)

from .database import db
