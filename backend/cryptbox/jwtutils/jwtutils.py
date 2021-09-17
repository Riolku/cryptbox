import jwt

def verify_jwt(tkn, key):
  try:
    return jwt.decode(tkn, key, algorithms = ["HS256"])
  except jwt.exceptions.ExpiredSignatureError:
    raise ExpiredJWT()
  except:
    raise InvalidJWT()

def make_jwt(payload, key):
  return jwt.encode(payload, key, algorithm = "HS256")
