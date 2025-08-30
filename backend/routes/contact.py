from flask import Blueprint, request, jsonify
from config import Config
from models import ContactMessage
import json
import os
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

contact_bp = Blueprint('contact', __name__)

# MongoDB connection
client = MongoClient(Config.MONGODB_URI)
db = client[Config.MONGODB_DBNAME]
contact_collection = db['contact_messages']

@contact_bp.route('/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()

        # Create new contact message
        contact_message = ContactMessage(
            full_name=data.get('full_name'),
            email=data.get('email'),
            phone=data.get('phone'),
            message=data.get('message'),
            created_at=datetime.utcnow()
        )

        # Insert into MongoDB
        result = contact_collection.insert_one(contact_message.to_dict())

        return jsonify({
            "success": True,
            "message": "Contact form submitted successfully",
            "id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error submitting contact form: {str(e)}"
        }), 500

@contact_bp.route('/contact/faqs', methods=['GET'])
def get_contact_faqs():
    try:
        # Get FAQs from MongoDB instead of JSON file
        faqs = list(db.faqs.find({}, {'_id': 0}))
        return jsonify(faqs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# admin routes for contact messages
@contact_bp.route('/admin/contact-messages', methods=['GET'])
def get_contact_messages():
    try:
        # Get all contact messages, sorted by date (newest first)
        messages = list(contact_collection.find().sort('created_at', -1))
        
        # Convert ObjectId to string for JSON serialization
        for message in messages:
            message['_id'] = str(message['_id'])
            
        return jsonify(messages)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contact_bp.route('/admin/contact-messages/<message_id>', methods=['PUT'])
def update_contact_message(message_id):
    try:
        data = request.get_json()
        
        result = contact_collection.update_one(
            {'_id': ObjectId(message_id)},
            {'$set': data}
        )
        
        if result.matched_count:
            return jsonify({'message': 'Contact message updated successfully'})
        else:
            return jsonify({'error': 'Contact message not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contact_bp.route('/admin/contact-messages/<message_id>', methods=['DELETE'])
def delete_contact_message(message_id):
    try:
        result = contact_collection.delete_one({'_id': ObjectId(message_id)})
        
        if result.deleted_count:
            return jsonify({'message': 'Contact message deleted successfully'})
        else:
            return jsonify({'error': 'Contact message not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500