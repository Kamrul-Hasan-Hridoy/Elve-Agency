from flask import Blueprint, jsonify
from config import Config
import json
import os

blogs_bp = Blueprint('blogs', __name__)

@blogs_bp.route('/blogs', methods=['GET'])
def get_blogs():
    try:
        if not os.path.exists(Config.BLOGS_DATA):
            return jsonify({"error": "Blogs data not found"}), 404
        
        with open(Config.BLOGS_DATA, 'r') as f:
            data = json.load(f)
            return jsonify(data)
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500