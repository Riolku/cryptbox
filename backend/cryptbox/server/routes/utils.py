from flask import request, Response

import json

def make_json_response(func):
    def inner_function(*args, **kwargs):
        inner_result = func(*args, **kwargs)
        
        return Response(json.dumps(inner_result), mimetype = "application/json")

    return inner_function

def wrap_request(decorated_function):
    @make_json_response
    def inner_function(*args, **kwargs):
        if request.is_json:
            return decorated_function(*args, **kwargs)

        return dict(
            status = "ERROR",
            code = "INVALID_MIMETYPE"
        )

    inner_function.__name__ = decorated_function.__name__

    return inner_function
