from flask import Flask, send_from_directory
from flask_cors import CORS
import os

# Import blueprints
from routes.home import home_bp
from routes.about import about_bp
from routes.services import services_bp
from routes.projects import projects_bp
from routes.pricing import pricing_bp
from routes.blogs import blogs_bp
from routes.testimonials import testimonials_bp
from routes.clients import clients_bp
from routes.faqs import faqs_bp

app = Flask(__name__)
CORS(app)  # Enable CORS

# Register blueprints
app.register_blueprint(home_bp, url_prefix='/api')
app.register_blueprint(about_bp, url_prefix='/api')
app.register_blueprint(services_bp, url_prefix='/api')
app.register_blueprint(projects_bp, url_prefix='/api')
app.register_blueprint(pricing_bp, url_prefix='/api')
app.register_blueprint(blogs_bp, url_prefix='/api')
app.register_blueprint(testimonials_bp, url_prefix='/api')
app.register_blueprint(clients_bp, url_prefix='/api')
app.register_blueprint(faqs_bp, url_prefix='/api')

@app.route('/')
def index():
    return "Elve Agency Backend API"

# ✅ Serve images from backend/static/images
@app.route('/images/<path:filename>')
def serve_images(filename):
    images_dir = os.path.join(app.root_path, 'static/images')
    return send_from_directory(images_dir, filename)

# ✅ Optional: placeholder
@app.route('/placeholder.png')
def serve_placeholder():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'placeholder.png')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
