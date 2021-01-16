from cryptbox.database import db

from .directories import Directories

from ..aliases import *

from ..size_constants.users import *

class Users(db.Model):
    __tablename__ = "users"

    id = dbcol(dbint, primary_key = True)

    username = dbcol(dbstr(USERNAME_MAX_LENGTH), unique = True, nullable = False)
    password_hash = dbcol(dbbinary, nullable = False)
    salt = dbcol(dbbinary, nullable = False)
    
    home = dbcol(dbint, dbforkey(Directories.id), nullable = True)
    trash = dbcol(dbint, dbforkey(Directories.id), nullable = True)