from cryptbox.database import db

from .directories import Directories

from ..aliases import *

class Files:
    __tablename__ = "files"

    id = dbcol(dbint, primary_key = True)

    directory = dbcol(dbint, dbforkey(Directories.id), nullable = False)

    encrypted_name = dbcol(dbstr(NAME_MAX_LENGTH), nullable = False)
