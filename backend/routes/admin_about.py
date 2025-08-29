from flask import Blueprint, request, jsonify
from models import about_collection
from bson import ObjectId
import json
from routes.admin import verify_admin_token

admin_about_bp = Blueprint('admin_about', __name__)

@admin_about_bp.route('/admin/about', methods=['GET'])
def get_about_admin():
    try:
        # Verify admin token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
            
        token = auth_header.split(' ')[1]
        if not verify_admin_token(token):
            return jsonify({'error': 'Invalid token'}), 401
        
        about_data = about_collection.find_one()
        if about_data:
            about_data['_id'] = str(about_data['_id'])
            return jsonify(about_data)
        else:
            return jsonify({'error': 'About data not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_about_bp.route('/admin/about/<section>', methods=['PUT'])
def update_about_section(section):
    try:
        # Verify admin token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Unauthorized'}), 401
            
        token = auth_header.split(' ')[1]
        if not verify_admin_token(token):
            return jsonify({'error': 'Invalid token'}), 401
        
        data = request.get_json()
        
        # Convert section from kebab-case to camelCase
        section_map = {
            'learn-container': 'learnContainer',
            'story-section': 'storySection',
            'core-values': 'coreValues',
            'team': 'team',
            'services': 'services',
            'testimonials': 'testimonials',
            'awards': 'awards',
            'faqs': 'faqs'
        }
        
        camel_section = section_map.get(section, section)
        
        # Update the specific section
        result = about_collection.update_one(
            {}, 
            {'$set': {camel_section: data}},
            upsert=True
        )
        
        if result.modified_count > 0 or result.upserted_id:
            return jsonify({'message': f'{section} updated successfully'})
        else:
            return jsonify({'error': 'Failed to update section'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500