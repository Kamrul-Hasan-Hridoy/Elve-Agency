from flask import Blueprint, jsonify
from config import Config
import json
import os

clients_bp = Blueprint('clients', __name__)

@clients_bp.route('/clients', methods=['GET'])
def get_clients():
    if not os.path.exists(Config.CLIENTS_DATA):
        return jsonify({"error": "Clients data not found"}), 404
    
    with open(Config.CLIENTS_DATA, 'r') as f:
        data = json.load(f)
        return jsonify(data)