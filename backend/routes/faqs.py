from flask import Blueprint, jsonify
from models import faqs_collection
import json
import os

faqs_bp = Blueprint('faqs', __name__)

@faqs_bp.route('/faqs', methods=['GET'])
def get_faqs():
    try:
        faqs = list(faqs_collection.find({}, {'_id': 0}))

        if not faqs:
            json_path = os.path.join(os.path.dirname(__file__), '../data/faqs.json')
            if os.path.exists(json_path):
                with open(json_path, 'r') as f:
                    faqs = json.load(f)
                    if faqs:
                        faqs_collection.insert_many(faqs)
                        faqs = list(faqs_collection.find({}, {'_id': 0}))

        return jsonify(faqs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500