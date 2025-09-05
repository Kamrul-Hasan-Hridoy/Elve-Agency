from functools import wraps
from flask import request, jsonify
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime

load_dotenv()

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
            
        try:
            # Simple token-based authentication
            token = auth_header.split(' ')[1]  # Bearer TOKEN
            
            # Try to verify JWT token first
            try:
                decoded = jwt.decode(token, os.getenv('JWT_SECRET', 'secret_key'), algorithms=['HS256'])
                # Check if token is expired
                if datetime.utcnow() > datetime.fromtimestamp(decoded['exp']):
                    return jsonify({'error': 'Token expired'}), 401
                return f(*args, **kwargs)
            except jwt.InvalidTokenError:
                # Fall back to simple token comparison
                expected_token = os.getenv('ADMIN_TOKEN', 'default_admin_token')
                if token != expected_token:
                    return jsonify({'error': 'Invalid token'}), 401
                
        except Exception as e:
            return jsonify({'error': 'Invalid authorization header'}), 401
            
        return f(*args, **kwargs)
    return decorated