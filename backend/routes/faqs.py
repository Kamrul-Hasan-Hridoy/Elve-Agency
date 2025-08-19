from flask import Blueprint, jsonify
from config import Config
import json
import os

faqs_bp = Blueprint('faqs', __name__)

@faqs_bp.route('/faqs', methods=['GET'])
def get_faqs():
    if not os.path.exists(Config.FAQS_DATA):
        return jsonify({"error": "FAQs data not found"}), 404
    
    with open(Config.FAQS_DATA, 'r') as f:
        data = json.load(f)
        return jsonify(data)