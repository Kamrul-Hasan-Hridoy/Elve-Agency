from flask import Blueprint, jsonify
from models import pricing_collection
import json
import os

pricing_bp = Blueprint('pricing', __name__)

@pricing_bp.route('/pricing', methods=['GET'])
def get_pricing():
    try:

        pricing_data = list(pricing_collection.find({}, {'_id': 0}))
        
        if not pricing_data:

            json_path = os.path.join(os.path.dirname(__file__), '../data/pricing.json')
            if os.path.exists(json_path):
                with open(json_path, 'r') as f:
                    pricing_data = json.load(f)
                    # Insert into MongoDB for future requests
                    if pricing_data:
                        pricing_collection.insert_many(pricing_data)
                        pricing_data = list(pricing_collection.find({}, {'_id': 0}))
        
        return jsonify(pricing_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500