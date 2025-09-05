from flask import Blueprint, jsonify, request
from models import clients_collection
from bson import ObjectId
from datetime import datetime
import os

clients_bp = Blueprint('clients', __name__)

@clients_bp.route('/clients', methods=['GET'])
def get_clients():
    try:
        clients = list(clients_collection.find({}, {'_id': 0}))
        return jsonify(clients)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@clients_bp.route('/admin/clients', methods=['GET', 'POST'])
def manage_clients():
    try:
        if request.method == 'GET':
            clients = list(clients_collection.find({}))
            # Convert ObjectId to string for JSON serialization
            for client in clients:
                if '_id' in client:
                    client['_id'] = str(client['_id'])
            return jsonify(clients)
        
        elif request.method == 'POST':
            data = request.json
            
            # Generate new ID
            last_client = clients_collection.find_one(sort=[("id", -1)])
            new_id = last_client['id'] + 1 if last_client else 1
            
            client = {
                "id": new_id,
                "name": data.get('name', ''),
                "logo": data['logo'],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = clients_collection.insert_one(client)
            return jsonify({
                "message": "Client added successfully",
                "id": new_id,
                "_id": str(result.inserted_id)
            }), 201
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@clients_bp.route('/admin/clients/<client_id>', methods=['PUT', 'DELETE'])
def manage_client(client_id):
    try:
        if request.method == 'PUT':
            data = request.json
            
            # Try to find by ID first (numeric)
            try:
                client_id_int = int(client_id)
                query = {"id": client_id_int}
            except ValueError:
                # If not numeric, try ObjectId
                try:
                    query = {"_id": ObjectId(client_id)}
                except:
                    return jsonify({"error": "Invalid client ID"}), 400
            
            update_data = {
                "name": data.get('name', ''),
                "logo": data['logo'],
                "updated_at": datetime.utcnow()
            }
            
            result = clients_collection.update_one(
                query,
                {"$set": update_data}
            )
            
            if result.matched_count == 0:
                return jsonify({"error": "Client not found"}), 404
                
            return jsonify({"message": "Client updated successfully"})
        
        elif request.method == 'DELETE':
            # Try to find by ID first (numeric)
            try:
                client_id_int = int(client_id)
                query = {"id": client_id_int}
            except ValueError:
                # If not numeric, try ObjectId
                try:
                    query = {"_id": ObjectId(client_id)}
                except:
                    return jsonify({"error": "Invalid client ID"}), 400
            
            result = clients_collection.delete_one(query)
            
            if result.deleted_count == 0:
                return jsonify({"error": "Client not found"}), 404
                
            return jsonify({"message": "Client deleted successfully"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500