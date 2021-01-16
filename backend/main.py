from flask import Flask

import cryptbox.server.routes

app = Flask('cryptbox', root_path = "cryptbox")

if __name__ == '__main__':
    app.run(debug = True)
