from flask import Blueprint, jsonify
from config import Config
import json
import os

pricing_bp = Blueprint('pricing', __name__)

@pricing_bp.route('/pricing', methods=['GET'])
def get_pricing():
    if not os.path.exists(Config.PRICING_DATA):
        return jsonify({"error": "Pricing data not found"}), 404
    
    with open(Config.PRICING_DATA, 'r') as f:
        data = json.load(f)
        return jsonify(data)