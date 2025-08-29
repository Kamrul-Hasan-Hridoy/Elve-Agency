from flask import Blueprint, jsonify, request
from models import testimonials_collection
from bson import ObjectId
import json
import os

testimonials_bp = Blueprint('testimonials', __name__)

@testimonials_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    try:
        testimonials = list(testimonials_collection.find({}, {'_id': 0}))
        return jsonify(testimonials)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@testimonials_bp.route('/admin/testimonials', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_testimonials():
    try:
        if request.method == 'GET':
            testimonials = list(testimonials_collection.find({}, {'_id': 0}))
            return jsonify(testimonials)
        
        elif request.method == 'POST':
            data = request.json
            # Generate new ID
            last_testimonial = testimonials_collection.find_one(sort=[("id", -1)])
            new_id = last_testimonial['id'] + 1 if last_testimonial else 1
            
            testimonial = {
                "id": new_id,
                "desc": data['desc'],
                "name": data['name'],
                "role": data['role'],
                "img": data.get('img', "/images/Ellipse 2.png")
            }
            
            testimonials_collection.insert_one(testimonial)
            return jsonify({"message": "Testimonial added successfully"})
        
        elif request.method == 'PUT':
            data = request.json
            testimonials_collection.update_one(
                {"id": data['id']},
                {"$set": {
                    "desc": data['desc'],
                    "name": data['name'],
                    "role": data['role'],
                    "img": data.get('img', "/images/Ellipse 2.png")
                }}
            )
            return jsonify({"message": "Testimonial updated successfully"})
        
        elif request.method == 'DELETE':
            testimonial_id = request.args.get('id')
            testimonials_collection.delete_one({"id": int(testimonial_id)})
            return jsonify({"message": "Testimonial deleted successfully"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500