from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
import os
import json
from models import services_collection
from auth import auth_required

services_bp = Blueprint('services', __name__)

@services_bp.route('/services', methods=['GET'])
def get_services():
    try:
        services = list(services_collection.find({}, {'_id': 0}))
        
        # If no services in database, load from JSON file
        if not services:
            json_path = os.path.join(os.path.dirname(__file__), '../data/services.json')
            if os.path.exists(json_path):
                with open(json_path, 'r') as f:
                    services = json.load(f)
                    # Insert into MongoDB for future requests
                    if services:
                        # Add IDs to services from JSON
                        for i, service in enumerate(services):
                            service['id'] = i + 1
                        services_collection.insert_many(services)
                        services = list(services_collection.find({}, {'_id': 0}))
        
        return jsonify(services)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@services_bp.route('/services/admin', methods=['GET'])
@auth_required
def get_services_admin():
    try:
        services = list(services_collection.find({}))
        # Convert ObjectId to string for JSON serialization
        for service in services:
            service['_id'] = str(service['_id'])
        return jsonify(services)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@services_bp.route('/services', methods=['POST'])
@auth_required
def add_service():
    try:
        data = request.get_json()
        
        # Get the next ID
        last_service = services_collection.find_one(sort=[("id", -1)])
        next_id = last_service['id'] + 1 if last_service else 1
        
        service = {
            "id": next_id,
            "title": data['title'],
            "icon": data.get('icon', ''),
            "desc": data['desc'],
            "list": data.get('list', []),
            "image": data.get('image', ''),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = services_collection.insert_one(service)
        return jsonify({'message': 'Service added successfully', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@services_bp.route('/services/<service_id>', methods=['PUT'])
@auth_required
def update_service(service_id):
    try:
        data = request.get_json()
        
        update_data = {
            "title": data['title'],
            "icon": data.get('icon', ''),
            "desc": data['desc'],
            "list": data.get('list', []),
            "image": data.get('image', ''),
            "updated_at": datetime.utcnow()
        }
        
        result = services_collection.update_one(
            {"id": int(service_id)}, 
            {"$set": update_data}
        )
        
        if result.matched_count:
            return jsonify({'message': 'Service updated successfully'})
        else:
            return jsonify({'error': 'Service not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@services_bp.route('/services/<service_id>', methods=['DELETE'])
@auth_required
def delete_service(service_id):
    try:
        result = services_collection.delete_one({"id": int(service_id)})
        
        if result.deleted_count:
            return jsonify({'message': 'Service deleted successfully'})
        else:
            return jsonify({'error': 'Service not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500