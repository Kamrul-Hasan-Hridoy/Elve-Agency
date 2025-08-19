from flask import Blueprint, jsonify
from config import Config
import json
import os

home_bp = Blueprint('home', __name__)

@home_bp.route('/home', methods=['GET'])
def get_home():
    if not os.path.exists(Config.HOME_DATA):
        return jsonify({"error": "Home data not found"}), 404
    
    with open(Config.HOME_DATA, 'r') as f:
        data = json.load(f)
        return jsonify(data)