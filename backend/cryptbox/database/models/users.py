from cryptbox.database import db

from ..aliases import *

class Users(db.Model):
    __tablename__ = "users"

    id = dbcol(dbint, primary_key = True)

    username = dbcol(dbstr(256), unique = True, nullable = False)
    password_hash = dbcol(dbbinary, nullable = False)
    salt = dbcol(dbstr(16), nullable = False)

    encrypted_private_key = dbcol(dbstr(65536), nullable = False)
    public_key = dbcol(dbstr(65536), nullable = False)
