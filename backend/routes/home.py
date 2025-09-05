from flask import Blueprint, jsonify, request
from models import home_collection
import json
import os
from config import Config

home_bp = Blueprint('home', __name__)

@home_bp.route('/home', methods=['GET'])
def get_home():
    try:
        # Try to get home data from MongoDB
        home_data = home_collection.find_one({}, {'_id': 0})
        
        if home_data:
            return jsonify(home_data)
        
        # If not found in DB, load from JSON file and save to DB
        if os.path.exists(Config.HOME_DATA):
            with open(Config.HOME_DATA, 'r') as f:
                home_data = json.load(f)
                home_collection.insert_one(home_data)
                return jsonify(home_data)
        
        return jsonify({"error": "Home data not found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Update whole home document
@home_bp.route('/admin/home', methods=['PUT'])
def update_home():
    try:
        data = request.get_json()
        result = home_collection.update_one({}, {'$set': data}, upsert=True)
        return jsonify({'message': 'Home data updated successfully'})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#  Update only specific section 
@home_bp.route('/admin/home/section/<section>', methods=['PUT'])
def update_home_section(section):
    try:
        data = request.get_json()
        result = home_collection.update_one({}, {'$set': {section: data}}, upsert=True)
        return jsonify({'message': f'{section} section updated successfully'})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
