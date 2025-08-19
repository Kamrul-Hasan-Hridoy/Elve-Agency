



from flask import Blueprint, jsonify, request
import json
import os
import logging
from config import Config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/projects', methods=['GET'])
def get_projects():
    try:
        # Log request
        logger.info(f"Projects request received. Category: {request.args.get('category', 'All Blog')}")
        
        if not os.path.exists(Config.PROJECTS_DATA):
            logger.error("Projects data file not found")
            return jsonify({"error": "Projects data not found"}), 404
        
        with open(Config.PROJECTS_DATA, 'r') as f:
            projects = json.load(f)
        
        category = request.args.get('category', 'All Blog')
        
        if category == 'All Blog':
            logger.info(f"Returning all {len(projects)} projects")
            return jsonify(projects)
        
        filtered = [p for p in projects if p['category'] == category]
        logger.info(f"Returning {len(filtered)} projects for category: {category}")
        return jsonify(filtered)
        
    except Exception as e:
        logger.error(f"Error in get_projects: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@projects_bp.route('/filters', methods=['GET'])
def get_filters():
    filters = [
        "All Blog", 
        "Mobile App", 
        "Website Design", 
        "Dashboard", 
        "Product Design", 
        "Branding"
    ]
    return jsonify(filters)