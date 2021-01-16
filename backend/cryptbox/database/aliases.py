from cryptbox.database import db

dbcol = db.Column
dbint = db.Integer
dbstr = db.String
dbbinary = db.Binary

def dbforkey(*args, **kwargs):
    return db.ForeignKey(*args, **kwargs, onupdate = "CASCADE", ondelete = "CASCADE")
