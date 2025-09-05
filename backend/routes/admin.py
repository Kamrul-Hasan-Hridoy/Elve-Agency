from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv
import jwt
import sys
from datetime import datetime, timedelta
from auth import auth_required
from bson import ObjectId
import sys



# Add the parent directory to the path to import models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import (
    services_collection, testimonials_collection, 
    clients_collection, faqs_collection,home_collection,
    pricing_collection, about_collection, blogs_collection)

load_dotenv()

# Define the blueprint
admin_bp = Blueprint('admin', __name__)

# -------------------------------
# ADMIN AUTH
# -------------------------------
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


# -------------------------------
# SERVICE MANAGEMENT
# -------------------------------
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
        
        services_collection.insert_one(service)
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


# -------------------------------
# TESTIMONIALS MANAGEMENT
# -------------------------------
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
        
        testimonials_collection.insert_one(testimonial)
        return jsonify({'message': 'Testimonial added successfully', 'id': next_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/testimonials/<testimonial_id>', methods=['PUT'])
@auth_required
def update_testimonial(testimonial_id):
    try:
        data = request.get_json()
        
        update_data = {
            "name": data['name'],
            "role": data['role'],
            "desc": data['desc'],
            "img": data.get('img', '/images/Ellipse 2.png'),
            "updated_at": datetime.utcnow()
        }
        
        # Handle both integer IDs and MongoDB ObjectIds
        try:
            query = {"id": int(testimonial_id)}
        except ValueError:
            query = {"_id": ObjectId(testimonial_id)}
        
        result = testimonials_collection.update_one(query, {"$set": update_data})
        
        if result.matched_count:
            return jsonify({'message': 'Testimonial updated successfully'})
        else:
            return jsonify({'error': 'Testimonial not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/testimonials/<testimonial_id>', methods=['DELETE'])
@auth_required
def delete_testimonial(testimonial_id):
    try:
        try:
            query = {"id": int(testimonial_id)}
        except ValueError:
            query = {"_id": ObjectId(testimonial_id)}
        
        result = testimonials_collection.delete_one(query)
        
        if result.deleted_count:
            return jsonify({'message': 'Testimonial deleted successfully'})
        else:
            return jsonify({'error': 'Testimonial not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# -------------------------------
# BLOG MANAGEMENT
# -------------------------------
@admin_bp.route('/admin/blogs', methods=['GET'])
@auth_required
def get_blogs_admin():
    try:
        blogs = list(blogs_collection.find({}))
        # Convert ObjectId to string for JSON serialization
        for blog in blogs:
            if '_id' in blog:
                blog['_id'] = str(blog['_id'])
        return jsonify(blogs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/blogs', methods=['POST'])
@auth_required
def add_blog():
    try:
        data = request.get_json()
        
        # Generate new ID
        last_blog = blogs_collection.find_one(sort=[("id", -1)])
        next_id = last_blog['id'] + 1 if last_blog and 'id' in last_blog else 1
        
        blog = {
            "id": next_id,
            "title": data.get('title', ''),
            "category": data.get('category', ''),
            "description": data.get('description', ''),
            "content": data.get('content', ''),
            "image": data.get('image', ''),
            "date": data.get('date', ''),
            "read_time": data.get('read_time', ''),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = blogs_collection.insert_one(blog)
        return jsonify({
            "message": "Blog added successfully",
            "id": next_id,
            "_id": str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/blogs/<blog_id>', methods=['PUT'])
@auth_required
def update_blog(blog_id):
    try:
        data = request.get_json()
        
        # Try to find by ID first (numeric)
        try:
            blog_id_int = int(blog_id)
            query = {"id": blog_id_int}
        except ValueError:
            # If not numeric, try ObjectId
            try:
                query = {"_id": ObjectId(blog_id)}
            except:
                return jsonify({"error": "Invalid blog ID"}), 400
        
        update_data = {
            "title": data.get('title', ''),
            "category": data.get('category', ''),
            "description": data.get('description', ''),
            "image": data.get('image', ''),
            "date": data.get('date', ''),
            "read_time": data.get('read_time', ''),
            "updated_at": datetime.utcnow()
        }
        
        result = blogs_collection.update_one(
            query,
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Blog not found"}), 404
            
        return jsonify({"message": "Blog updated successfully"})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/blogs/<blog_id>', methods=['DELETE'])
@auth_required
def delete_blog(blog_id):
    try:
        # Try to find by ID first (numeric)
        try:
            blog_id_int = int(blog_id)
            query = {"id": blog_id_int}
        except ValueError:
            # If not numeric, try ObjectId
            try:
                query = {"_id": ObjectId(blog_id)}
            except:
                return jsonify({"error": "Invalid blog ID"}), 400
        
        result = blogs_collection.delete_one(query)
        
        if result.deleted_count == 0:
            return jsonify({"error": "Blog not found"}), 404
            
        return jsonify({"message": "Blog deleted successfully"})
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# -------------------------------
# ABOUT MANAGEMENT
# -------------------------------
@admin_bp.route('/admin/about', methods=['GET'])
@auth_required
def get_about_admin():
    try:
        about_data = about_collection.find_one({}, {'_id': 0})
        if about_data:
            return jsonify(about_data)
        else:
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
        if '_id' in data:
            del data['_id']
        about_collection.update_one({}, {'$set': data}, upsert=True)
        return jsonify({'message': 'About page updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/about/<section>', methods=['PUT'])
@auth_required
def update_about_section(section):
    try:
        data = request.get_json()
        about_collection.update_one(
            {},
            {'$set': {section: data}},
            upsert=True
        )
        return jsonify({'message': f'{section} updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# -------------------------------
# PRICING MANAGEMENT (supports int + ObjectId)
# -------------------------------
@admin_bp.route('/admin/pricing', methods=['GET'])
@auth_required
def get_pricing_admin():
    try:
        pricing_data = list(pricing_collection.find({}))
        for plan in pricing_data:
            plan['_id'] = str(plan['_id'])
            if 'id' not in plan:
                plan['id'] = str(plan['_id'])
        return jsonify(pricing_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/pricing', methods=['POST'])
@auth_required
def add_pricing_plan():
    try:
        data = request.get_json()
        last_plan = pricing_collection.find_one(sort=[("id", -1)])
        next_id = last_plan['id'] + 1 if last_plan and 'id' in last_plan else 1
        
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
        pricing_collection.insert_one(plan)
        return jsonify({'message': 'Pricing plan added successfully', 'id': next_id}), 201
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
        
        try:
            query = {"id": int(plan_id)}
        except ValueError:
            query = {"_id": ObjectId(plan_id)}
        
        result = pricing_collection.update_one(query, {"$set": update_data})
        
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
        try:
            query = {"id": int(plan_id)}
        except ValueError:
            query = {"_id": ObjectId(plan_id)}
        
        result = pricing_collection.delete_one(query)
        
        if result.deleted_count:
            return jsonify({'message': 'Pricing plan deleted successfully'})
        else:
            return jsonify({'error': 'Pricing plan not found'}), 404
    except Exception as e: 
        return jsonify({'error': str(e)}), 500


# -------------------------------
# CLIENT MANAGEMENT
# -------------------------------
@admin_bp.route('/admin/clients', methods=['POST'])
@auth_required
def add_client():
    try:
        data = request.get_json()
        
        last_client = clients_collection.find_one(sort=[("id", -1)])
        next_id = last_client['id'] + 1 if last_client and 'id' in last_client else 1
        
        client = {
            "id": next_id,
            "name": data.get('name', ''),
            "logo": data['logo'],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        clients_collection.insert_one(client)
        return jsonify({'message': 'Client added successfully', 'id': next_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
    # Add this import at the top
from models import projects_collection

# -------------------------------
# PROJECT MANAGEMENT
# -------------------------------
@admin_bp.route('/admin/projects', methods=['GET'])
@auth_required
def get_projects_admin():
    try:
        projects = list(projects_collection.find({}))
        # Convert ObjectId to string for JSON serialization
        for project in projects:
            if '_id' in project:
                project['_id'] = str(project['_id'])
        return jsonify(projects)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/projects', methods=['POST'])
@auth_required
def add_project():
    try:
        data = request.get_json()
        
        # Get the next ID
        last_project = projects_collection.find_one(sort=[("id", -1)])
        next_id = last_project['id'] + 1 if last_project and 'id' in last_project else 1
        
        project = {
            "id": next_id,
            "title": data['title'],
            "category": data['category'],
            "description": data['description'],
            "image": data.get('image', ''),
            "tags": data.get('tags', []),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        projects_collection.insert_one(project)
        return jsonify({'message': 'Project added successfully', 'id': next_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/projects/<project_id>', methods=['PUT'])
@auth_required
def update_project(project_id):
    try:
        data = request.get_json()
        
        update_data = {
            "title": data['title'],
            "category": data['category'],
            "description": data['description'],
            "image": data.get('image', ''),
            "tags": data.get('tags', []),
            "updated_at": datetime.utcnow()
        }
        
        # Try to find by ID first (numeric)
        try:
            project_id_int = int(project_id)
            query = {"id": project_id_int}
        except ValueError:
            # If not numeric, try ObjectId
            try:
                query = {"_id": ObjectId(project_id)}
            except:
                return jsonify({"error": "Invalid project ID"}), 400
        
        result = projects_collection.update_one(
            query,
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Project not found"}), 404
            
        return jsonify({"message": "Project updated successfully"})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/projects/<project_id>', methods=['DELETE'])
@auth_required
def delete_project(project_id):
    try:
        # Try to find by ID first (numeric)
        try:
            project_id_int = int(project_id)
            query = {"id": project_id_int}
        except ValueError:
            # If not numeric, try ObjectId
            try:
                query = {"_id": ObjectId(project_id)}
            except:
                return jsonify({"error": "Invalid project ID"}), 400
        
        result = projects_collection.delete_one(query)
        
        if result.deleted_count == 0:
            return jsonify({"error": "Project not found"}), 404
            
        return jsonify({"message": "Project deleted successfully"})
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
    # -------------------------------
# HOME PAGE MANAGEMENT
# -------------------------------
@admin_bp.route('/admin/home', methods=['GET'])
@auth_required
def get_home_admin():
    try:
        home_data = home_collection.find_one({})
        if home_data and '_id' in home_data:
            home_data['_id'] = str(home_data['_id'])
        return jsonify(home_data or {})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/home', methods=['PUT'])
@auth_required
def update_home():
    try:
        data = request.get_json()
        if '_id' in data:
            del data['_id']
            
        # Update or insert home data
        result = home_collection.update_one({}, {'$set': data}, upsert=True)
        return jsonify({'message': 'Home page updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/admin/home/section/<section_name>', methods=['PUT'])
@auth_required
def update_home_section(section_name):
    try:
        data = request.get_json()
        home_collection.update_one(
            {},
            {'$set': {section_name: data}},
            upsert=True
        )
        return jsonify({'message': f'{section_name} section updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500