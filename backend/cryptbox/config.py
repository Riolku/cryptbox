from flask import json

CONFIGURATION_FILE_NAME = "/srv/cryptbox/config.json"

def configure_app(app):
    secret_config = json.load(open(CONFIGURATION_FILE_NAME))

    app.config.update(secret_config)

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
