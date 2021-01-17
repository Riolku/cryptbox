import os

BASE_DIR = "/srv/cryptbox/files/"

def get_file_path(file_id):
    return BASE_DIR + str(id)

def open_file(id, permissions):
    return open(get_file_path(id), permissions)

def store_file_contents(file_id, contents):
    with open_file(file_id, "w") as f:
        f.write(contents)

def get_file_contents(file_id):
    with open_file(file_id, "r") as f:
        return f.read()

def delete_file_contents(file_id):
    os.remove(get_file_path(file_id))
