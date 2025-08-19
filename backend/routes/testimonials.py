from flask import Blueprint, jsonify
from config import Config
import json
import os

testimonials_bp = Blueprint('testimonials', __name__)

@testimonials_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    if not os.path.exists(Config.TESTIMONIALS_DATA):
        return jsonify({"error": "Testimonials data not found"}), 404
    
    with open(Config.TESTIMONIALS_DATA, 'r') as f:
        data = json.load(f)
        return jsonify(data)