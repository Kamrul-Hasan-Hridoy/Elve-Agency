from flask import Blueprint, jsonify
from models import clients_collection
import json
import os

clients_bp = Blueprint('clients', __name__)

@clients_bp.route('/clients', methods=['GET'])
def get_clients():
    try:
        clients = list(clients_collection.find({}, {'_id': 0}))
        
        if not clients:
            json_path = os.path.join(os.path.dirname(__file__), '../data/clients.json')
            if os.path.exists(json_path):
                with open(json_path, 'r') as f:
                    clients = json.load(f)
                    if clients:
                        clients_collection.insert_many(clients)
                        clients = list(clients_collection.find({}, {'_id': 0}))
        
        return jsonify(clients)
    except Exception as e:
        return jsonify({"error": str(e)}), 500