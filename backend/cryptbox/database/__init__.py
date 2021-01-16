from flask_sqlalchemy import SQLAlchemy

from cryptbox import app

db = SQLAlchemy(app)

from .models import *

db.create_all()
