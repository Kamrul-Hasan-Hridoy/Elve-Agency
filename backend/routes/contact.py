from flask import Blueprint, request, jsonify
from config import Config
from models import ContactMessage
import json
import os
from pymongo import MongoClient
from datetime import datetime

contact_bp = Blueprint('contact', __name__)

# MongoDB connection
client = MongoClient(Config.MONGODB_URI)
db = client[Config.MONGODB_DBNAME]
contact_collection = db['contact_messages']

@contact_bp.route('/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()

        #create new contact message
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
    if not os.path.exists(Config.FAQS_DATA):
        return jsonify({"error": "FAQs data not found"}), 404

    with open(Config.FAQS_DATA, 'r') as f:
        data = json.load(f)
        return jsonify(data)