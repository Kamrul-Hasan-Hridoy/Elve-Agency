from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId

# Import blueprints
from routes.home import home_bp
from routes.about import about_bp
from routes.services import services_bp
from routes.projects import projects_bp
from routes.pricing import pricing_bp
from routes.blogs import blogs_bp
from routes.contact import contact_bp
from routes.testimonials import testimonials_bp
from routes.clients import clients_bp
from routes.faqs import faqs_bp
from routes.admin import admin_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.after_request
def add_security_headers(response):
    response.headers['Content-Security-Policy'] = (
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; "
        "script-src * 'unsafe-inline' 'unsafe-eval' blob:; "
        "style-src * 'unsafe-inline'; "
        "img-src * data: blob:; "
        "font-src * data:; "
        "connect-src *; "
        "media-src *; "
        "object-src *; "
        "frame-src *;"
    )
    return response

# MongoDB
mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/elve_agency')
client = MongoClient(mongo_uri)
db = client.get_database(os.getenv('MONGODB_DBNAME', 'elve_agency'))
print("✅ Connected to MongoDB!......")

# Register blueprints
app.register_blueprint(home_bp, url_prefix='/api')
app.register_blueprint(about_bp, url_prefix='/api')
app.register_blueprint(services_bp, url_prefix='/api')
app.register_blueprint(projects_bp, url_prefix='/api')
app.register_blueprint(pricing_bp, url_prefix='/api')
app.register_blueprint(blogs_bp, url_prefix='/api')
app.register_blueprint(testimonials_bp, url_prefix='/api')
app.register_blueprint(contact_bp, url_prefix='/api')
app.register_blueprint(clients_bp, url_prefix='/api')
app.register_blueprint(faqs_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')

@app.route('/')
def index():
    return "Elve Agency Backend API"

# Static files - Serve images from static/images directory
@app.route('/images/<path:filename>')
def serve_images(filename):
    # Remove any leading 'images/' from the filename if present
    if filename.startswith('images/'):
        filename = filename[7:]  # Remove the first 7 characters ('images/')
    
    # Try to serve from static/images first
    static_images_dir = os.path.join(app.root_path, 'static', 'images')
    
    # Check if the file exists in static/images
    if os.path.exists(os.path.join(static_images_dir, filename)):
        return send_from_directory(static_images_dir, filename)
    
    # If not found, try other possible locations
    possible_dirs = [
        os.path.join(app.root_path, 'data', 'images'),
        os.path.join(app.root_path, '..', 'data', 'images'),
        os.path.join(app.root_path, '..', 'frontend', 'public', 'images'),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'images'),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'images'),
    ]
    
    for images_dir in possible_dirs:
        if os.path.exists(os.path.join(images_dir, filename)):
            return send_from_directory(images_dir, filename)
    
    # If not found in any directory, return 404
    return "Image not found", 404

# Add a route for JavaScript files if needed
@app.route('/js/<path:filename>')
def serve_js(filename):
    js_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'js')
    return send_from_directory(js_dir, filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    css_dir = os.path.join(app.root_path, 'static', 'css')
    return send_from_directory(css_dir, filename)

@app.route('/admin-panel')
def serve_admin_panel():
    return send_from_directory('../frontend/public', 'admin-panel.html')

# FAQ submission route for visitors
@app.route('/api/submit-question', methods=['POST'])
def submit_question():
    try:
        data = request.get_json()
        if not data or 'question' not in data:
            return jsonify({'error': 'Question is required'}), 400
        
        # Get the next ID
        last_question = db.submitted_questions.find_one(sort=[("id", -1)])
        next_id = last_question['id'] + 1 if last_question else 1
        
        question_data = {
            'id': next_id,
            'question': data['question'],
            'email': data.get('email', ''),
            'created_at': datetime.utcnow(),
            'answered': False,
            'answer': None,
            'answered_at': None
        }
        
        result = db.submitted_questions.insert_one(question_data)
        return jsonify({
            'message': 'Question submitted successfully',
            'id': next_id
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to get unanswered questions for admin
@app.route('/api/admin/submitted-questions')
def get_submitted_questions():
    try:
        questions = list(db.submitted_questions.find({"answered": False}))
        for question in questions:
            question['_id'] = str(question['_id'])
            # Convert datetime to string for JSON serialization
            if 'created_at' in question and isinstance(question['created_at'], datetime):
                question['created_at'] = question['created_at'].isoformat()
        return jsonify(questions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route for admin to answer a question
@app.route('/api/admin/answer-question/<question_id>', methods=['PUT'])
def answer_question(question_id):
    try:
        data = request.get_json()
        if not data or 'answer' not in data:
            return jsonify({'error': 'Answer is required'}), 400
        
        result = db.submitted_questions.update_one(
            {'id': int(question_id)},
            {'$set': {
                'answer': data['answer'],
                'answered': True,
                'answered_at': datetime.utcnow()
            }}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Question not found'}), 404
        
        # Add the answered question to the FAQs collection
        # Get the next FAQ ID
        last_faq = db.faqs.find_one(sort=[("id", -1)])
        next_faq_id = last_faq['id'] + 1 if last_faq else 1
        
        # Get the question data
        question_data = db.submitted_questions.find_one({'id': int(question_id)})
        
        # Create FAQ entry
        faq_data = {
            'id': next_faq_id,
            'question': question_data['question'],
            'answer': data['answer'],
            'open': False
        }
        
        db.faqs.insert_one(faq_data)
            
        return jsonify({'message': 'Question answered successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Debug routes
@app.route('/debug/routes')
def debug_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'path': str(rule)
        })
    return jsonify(routes)

@app.route('/debug/env')
def debug_env():
    env_vars = {key: value for key, value in os.environ.items() if 'MONGO' in key or 'FLASK' in key}
    return jsonify(env_vars)

@app.route('/debug/db')
def debug_db():
    try:
        client.admin.command('ping')
        collections = db.list_collection_names()
        return jsonify({
            'status': 'connected',
            'database': db.name,
            'collections': collections
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')