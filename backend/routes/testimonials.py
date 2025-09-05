from flask import Blueprint, jsonify, request
from models import testimonials_collection
from bson import ObjectId
from datetime import datetime
import os

testimonials_bp = Blueprint('testimonials', __name__)

@testimonials_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    try:
        testimonials = list(testimonials_collection.find({}, {'_id': 0}))
        return jsonify(testimonials)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@testimonials_bp.route('/admin/testimonials', methods=['GET'])
def get_testimonials_admin():
    try:
        testimonials = list(testimonials_collection.find({}))
        # Convert ObjectId to string for JSON serialization
        for testimonial in testimonials:
            if '_id' in testimonial:
                testimonial['_id'] = str(testimonial['_id'])
        return jsonify(testimonials)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@testimonials_bp.route('/admin/testimonials', methods=['POST'])
def add_testimonial():
    try:
        data = request.json
        
        # Generate new ID - handle cases where id field might not exist
        last_testimonial = testimonials_collection.find_one(sort=[("id", -1)])
        
        if last_testimonial and 'id' in last_testimonial:
            new_id = last_testimonial['id'] + 1
        else:
            new_id = 1
        
        testimonial = {
            "id": new_id,
            "desc": data.get('desc', ''),
            "name": data.get('name', ''),
            "role": data.get('role', ''),
            "img": data.get('img', "/images/Ellipse 2.png"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = testimonials_collection.insert_one(testimonial)
        return jsonify({
            "message": "Testimonial added successfully",
            "id": new_id,
            "_id": str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@testimonials_bp.route('/admin/testimonials/<testimonial_id>', methods=['PUT'])
def update_testimonial(testimonial_id):
    try:
        data = request.json
        
        # Try to find by ID first (numeric)
        try:
            testimonial_id_int = int(testimonial_id)
            query = {"id": testimonial_id_int}
        except ValueError:
            # If not numeric, try ObjectId
            try:
                query = {"_id": ObjectId(testimonial_id)}
            except:
                return jsonify({"error": "Invalid testimonial ID"}), 400
        
        update_data = {
            "desc": data.get('desc', ''),
            "name": data.get('name', ''),
            "role": data.get('role', ''),
            "img": data.get('img', "/images/Ellipse 2.png"),
            "updated_at": datetime.utcnow()
        }
        
        result = testimonials_collection.update_one(
            query,
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Testimonial not found"}), 404
            
        return jsonify({"message": "Testimonial updated successfully"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@testimonials_bp.route('/admin/testimonials/<testimonial_id>', methods=['DELETE'])
def delete_testimonial(testimonial_id):
    try:
        # Try to find by ID first (numeric)
        try:
            testimonial_id_int = int(testimonial_id)
            query = {"id": testimonial_id_int}
        except ValueError:
            # If not numeric, try ObjectId
            try:
                query = {"_id": ObjectId(testimonial_id)}
            except:
                return jsonify({"error": "Invalid testimonial ID"}), 400
        
        result = testimonials_collection.delete_one(query)
        
        if result.deleted_count == 0:
            return jsonify({"error": "Testimonial not found"}), 404
            
        return jsonify({"message": "Testimonial deleted successfully"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500