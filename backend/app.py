from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os
from pymongo import MongoClient
from dotenv import load_dotenv

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