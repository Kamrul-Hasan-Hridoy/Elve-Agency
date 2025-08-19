from flask import Blueprint, jsonify
from config import Config
import json
import os

about_bp = Blueprint('about', __name__)

@about_bp.route('/about', methods=['GET'])
def get_about():
    if not os.path.exists(Config.ABOUT_DATA):
        return jsonify({"error": "About data not found"}), 404
    
    with open(Config.ABOUT_DATA, 'r') as f:
        data = json.load(f)
        return jsonify(data)