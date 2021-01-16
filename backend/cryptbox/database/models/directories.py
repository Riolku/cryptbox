from cryptbox.database import db

from ..aliases import *

from ..size_constants.files import *

class Directories(db.Model):
    __tablename__ = "directories"

    id = dbcol(dbint, primary_key = True)

    encrypted_name = dbcol(dbstr(4096))
