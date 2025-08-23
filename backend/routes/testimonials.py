from flask import Blueprint, jsonify
from models import testimonials_collection
import json
import os

testimonials_bp = Blueprint('testimonials', __name__)

@testimonials_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    try:
        testimonials = list(testimonials_collection.find({}, {'_id': 0}))

        if not testimonials:
            json_path = os.path.join(os.path.dirname(__file__), '../data/testimonials.json')
            if os.path.exists(json_path):
                with open(json_path, 'r') as f:
                    testimonials = json.load(f)
                    if testimonials:
                        testimonials_collection.insert_many(testimonials)
                        testimonials = list(testimonials_collection.find({}, {'_id': 0}))

        return jsonify(testimonials)
    except Exception as e:
        return jsonify({"error": str(e)}), 500