from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from flask import Flask, jsonify

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
from routes.admin_about import admin_about_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# Remove or fix CSP headers temporarily for debugging
@app.after_request
def add_security_headers(response):
    # For development, use a permissive CSP
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

# Use MONGODB_URI from environment variables
mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/elve_agency')
client = MongoClient(mongo_uri)
db = client.get_database(os.getenv('MONGODB_DBNAME', 'elve_agency'))

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
app.register_blueprint(admin_about_bp, url_prefix='/api')

@app.route('/')
def index():
    return "Elve Agency Backend API"

# Serve static files
@app.route('/images/<path:filename>')
def serve_images(filename):
    images_dir = os.path.join(app.root_path, 'static/images')
    return send_from_directory(images_dir, filename)

@app.route('/css/<path:filename>')
def serve_css(filename):
    css_dir = os.path.join(app.root_path, 'static/css')
    return send_from_directory(css_dir, filename)

#  debug routes
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
        # Test database connection
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