from cryptbox import app

import cryptbox.server.routes

from flask_cors import CORS
CORS(app)

@app.after_request
def add_cors(response):
  response.headers["Access-Control-Allow-Origin"] = "http://167.99.181.60:3000"
  response.headers["Access-Control-Allow-Headers"] = "content-type"
  response.headers["Access-Control-Allow-Credentials"] = "true"
  return response

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 5000, debug = True)
