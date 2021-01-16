from cryptbox.database import db

from ..aliases import *

from ..size_constants.files import *

class Directories(db.Model):
    __tablename__ = "directories"

    id = dbcol(dbint, primary_key = True)

    parent = dbcol(dbint, dbforkey(Directories.id), nullable = True) # the parent of root-level directories should be null

    encrypted_name = dbcol(dbstr(NAME_MAX_LENGTH), nullable = False)
