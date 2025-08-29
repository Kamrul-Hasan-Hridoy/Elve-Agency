from flask import Blueprint, jsonify, request
from models import clients_collection
from bson import ObjectId
import json
import os

clients_bp = Blueprint('clients', __name__)

@clients_bp.route('/clients', methods=['GET'])
def get_clients():
    try:
        clients = list(clients_collection.find({}, {'_id': 0}))
        return jsonify(clients)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@clients_bp.route('/admin/clients', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_clients():
    try:
        if request.method == 'GET':
            clients = list(clients_collection.find({}, {'_id': 0}))
            return jsonify(clients)
        
        elif request.method == 'POST':
            data = request.json
            # Generate new ID
            last_client = clients_collection.find_one(sort=[("id", -1)])
            new_id = last_client['id'] + 1 if last_client else 1
            
            client = {
                "id": new_id,
                "logo": data['logo']
            }
            
            clients_collection.insert_one(client)
            return jsonify({"message": "Client added successfully"})
        
        elif request.method == 'PUT':
            data = request.json
            clients_collection.update_one(
                {"id": data['id']},
                {"$set": {
                    "logo": data['logo']
                }}
            )
            return jsonify({"message": "Client updated successfully"})
        
        elif request.method == 'DELETE':
            client_id = request.args.get('id')
            clients_collection.delete_one({"id": int(client_id)})
            return jsonify({"message": "Client deleted successfully"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    