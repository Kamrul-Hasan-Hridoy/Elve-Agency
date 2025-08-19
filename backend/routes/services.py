from flask import Blueprint, jsonify
from config import Config
import json
import os

services_bp = Blueprint('services', __name__)

@services_bp.route('/services', methods=['GET'])
def get_services():
    if not os.path.exists(Config.SERVICES_DATA):
        return jsonify({"error": "Services data not found"}), 404
    
    with open(Config.SERVICES_DATA, 'r') as f:
        data = json.load(f)
        return jsonify(data)