from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
from auth import auth_required
from bson import ObjectId
import sys
import os

# Add the parent directory to the path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import (
    services_collection, testimonials_collection, 
    clients_collection, faqs_collection, 
    pricing_collection, about_collection
)

load_dotenv()

# Define the blueprint
admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/login', methods=['POST', 'OPTIONS'])
def admin_login():
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        # Validate credentials
        if (username == os.getenv('ADMIN_USERNAME', 'admin') and 
            password == os.getenv('ADMIN_PASSWORD', 'adminpassword')):
            
            # Generate token
            token = jwt.encode({
                'sub': username,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, os.getenv('JWT_SECRET', 'secret_key'), algorithm='HS256')
            
            return jsonify({'token': token}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/verify', methods=['GET'])
@auth_required
def verify_token():
    return jsonify({'message': 'Token is valid'})

# Service Management Routes
@admin_bp.route('/admin/services', methods=['GET'])
@auth_required
def get_services_admin():
    try:
        services = list(services_collection.find({}, {'_id': 0}))
        return jsonify(services)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/services', methods=['POST'])
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
        return jsonify({'message': 'Service added successfully', 'id': next_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/services/<int:service_id>', methods=['PUT'])
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
            {"id": service_id}, 
            {"$set": update_data}
        )
        
        if result.matched_count:
            return jsonify({'message': 'Service updated successfully'})
        else:
            return jsonify({'error': 'Service not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/services/<int:service_id>', methods=['DELETE'])
@auth_required
def delete_service(service_id):
    try:
        result = services_collection.delete_one({"id": service_id})
        
        if result.deleted_count:
            return jsonify({'message': 'Service deleted successfully'})
        else:
            return jsonify({'error': 'Service not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Testimonials routes
@admin_bp.route('/admin/testimonials', methods=['GET'])
@auth_required
def get_testimonials_admin():
    try:
        testimonials = list(testimonials_collection.find({}, {'_id': 0}))
        return jsonify(testimonials)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/testimonials', methods=['POST'])
@auth_required
def add_testimonial():
    try:
        data = request.get_json()
        
        # Get the next ID
        last_testimonial = testimonials_collection.find_one(sort=[("id", -1)])
        next_id = last_testimonial['id'] + 1 if last_testimonial else 1
        
        testimonial = {
            "id": next_id,
            "name": data['name'],
            "role": data['role'],
            "desc": data['desc'],
            "img": data.get('img', ''),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = testimonials_collection.insert_one(testimonial)
        return jsonify({'message': 'Testimonial added successfully', 'id': next_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# About Management Routes - NO DUPLICATE ENDPOINTS
@admin_bp.route('/admin/about', methods=['GET'])
@auth_required
def get_about_admin():
    try:
        about_data = about_collection.find_one({}, {'_id': 0})
        if about_data:
            return jsonify(about_data)
        else:
            # Return default structure if no about data exists
            return jsonify({
                'learnContainer': {
                    'heading': 'Learn More\nAbout Us',
                    'videoImage': '/images/Frame (4).png'
                },
                'storySection': {
                    'mainHeading': 'The story of who we are\nand the vision that drives\nus forward',
                    'paragraphs': [
                        'Default paragraph 1',
                        'Default paragraph 2'
                    ],
                    'images': [
                        '/images/Frame (5).png',
                        '/images/Frame (6).png'
                    ]
                },
                'coreValues': [],
                'team': [],
                'services': [],
                'testimonials': [],
                'awards': [],
                'faqs': []
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/about', methods=['PUT'])
@auth_required
def update_about():
    try:
        data = request.get_json()
        
        # Remove _id if present
        if '_id' in data:
            del data['_id']
        
        # Update or insert the about data
        result = about_collection.update_one(
            {},
            {'$set': data},
            upsert=True
        )
        
        return jsonify({'message': 'About page updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# INDIVIDUAL SECTION NO DUPLICATE ENDPOINTS
@admin_bp.route('/admin/about/learn-container', methods=['PUT'])
@auth_required
def update_learn_container():
    try:
        data = request.get_json()
        result = about_collection.update_one(
            {},
            {'$set': {'learnContainer': data}},
            upsert=True
        )
        return jsonify({'message': 'Learn container updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/about/story-section', methods=['PUT'])
@auth_required
def update_story_section():
    try:
        data = request.get_json()
        result = about_collection.update_one(
            {},
            {'$set': {'storySection': data}},
            upsert=True
        )
        return jsonify({'message': 'Story section updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/about/core-values', methods=['PUT'])
@auth_required
def update_core_values():
    try:
        data = request.get_json()
        result = about_collection.update_one(
            {},
            {'$set': {'coreValues': data}},
            upsert=True
        )
        return jsonify({'message': 'Core values updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/about/team', methods=['PUT'])
@auth_required
def update_team():
    try:
        data = request.get_json()
        result = about_collection.update_one(
            {},
            {'$set': {'team': data}},
            upsert=True
        )
        return jsonify({'message': 'Team updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/about/services', methods=['PUT'])
@auth_required
def update_services():
    try:
        data = request.get_json()
        result = about_collection.update_one(
            {},
            {'$set': {'services': data}},
            upsert=True
        )
        return jsonify({'message': 'Services updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/about/testimonials', methods=['PUT'])
@auth_required
def update_testimonials():
    try:
        data = request.get_json()
        result = about_collection.update_one(
            {},
            {'$set': {'testimonials': data}},
            upsert=True
        )
        return jsonify({'message': 'Testimonials updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/about/awards', methods=['PUT'])
@auth_required
def update_awards():
    try:
        data = request.get_json()
        result = about_collection.update_one(
            {},
            {'$set': {'awards': data}},
            upsert=True
        )
        return jsonify({'message': 'Awards updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def verify_admin_token(token):
    try:
        # Use a secret key from environment variables
        secret = os.getenv('ADMIN_SECRET', 'your-secret-key')
        decoded = jwt.decode(token, secret, algorithms=['HS256'])
        return True
    except:
        return False


@admin_bp.route('/admin/about/faqs', methods=['PUT'])
@auth_required
def update_faqs():
    try:
        data = request.get_json()
        result = about_collection.update_one(
            {},
            {'$set': {'faqs': data}},
            upsert=True
        )
        return jsonify({'message': 'FAQs updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Pricing Management Routes
@admin_bp.route('/admin/pricing', methods=['GET'])
@auth_required
def get_pricing_admin():
    try:
        pricing_data = list(pricing_collection.find({}))
        # Convert ObjectId to string for JSON serialization
        for plan in pricing_data:
            plan['_id'] = str(plan['_id'])
        return jsonify(pricing_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/pricing', methods=['POST'])
@auth_required
def add_pricing_plan():
    try:
        data = request.get_json()
        
        # Get the next ID
        last_plan = pricing_collection.find_one(sort=[("id", -1)])
        next_id = last_plan['id'] + 1 if last_plan else 1
        
        plan = {
            "id": next_id,
            "name": data['name'],
            "badge": data.get('badge', ''),
            "description": data['description'],
            "price": data['price'],
            "price_period": data.get('price_period', '/month'),
            "features": data.get('features', []),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = pricing_collection.insert_one(plan)
        return jsonify({'message': 'Pricing plan added successfully', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/pricing/<plan_id>', methods=['PUT'])
@auth_required
def update_pricing_plan(plan_id):
    try:
        data = request.get_json()
        
        update_data = {
            "name": data['name'],
            "badge": data.get('badge', ''),
            "description": data['description'],
            "price": data['price'],
            "price_period": data.get('price_period', '/month'),
            "features": data.get('features', []),
            "updated_at": datetime.utcnow()
        }
        
        result = pricing_collection.update_one(
            {"id": int(plan_id)}, 
            {"$set": update_data}
        )
        
        if result.matched_count:
            return jsonify({'message': 'Pricing plan updated successfully'})
        else:
            return jsonify({'error': 'Pricing plan not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/pricing/<plan_id>', methods=['DELETE'])
@auth_required
def delete_pricing_plan(plan_id):
    try:
        result = pricing_collection.delete_one({"id": int(plan_id)})
        
        if result.deleted_count:
            return jsonify({'message': 'Pricing plan deleted successfully'})
        else:
            return jsonify({'error': 'Pricing plan not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500