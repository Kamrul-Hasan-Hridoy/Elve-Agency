import os
import jwt
from functools import wraps
from flask import request, jsonify

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            secret = os.getenv('ADMIN_SECRET', 'your-secret-key')
            data = jwt.decode(token, secret, algorithms=['HS256'])
        except:
            return jsonify({'error': 'Token is invalid'}), 401

        return f(*args, **kwargs)

    return decorated

def verify_admin_token(token):
    try:
        secret = os.getenv('ADMIN_SECRET', 'your-secret-key')
        decoded = jwt.decode(token, secret, algorithms=['HS256'])
        return True
    except:
        return False