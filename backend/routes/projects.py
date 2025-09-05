from flask import Blueprint, jsonify, request
from models import projects_collection
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/projects', methods=['GET'])
def get_projects():
    try:
        logger.info(f"Projects request received. Category: {request.args.get('category', 'All Blog')}")
        
        category = request.args.get('category', 'All Blog')
        
        if category == 'All Blog':
            projects = list(projects_collection.find({}, {'_id': 0}))
            logger.info(f"Returning all {len(projects)} projects")
            return jsonify(projects)
        
        filtered = list(projects_collection.find({"category": category}, {'_id': 0}))
        logger.info(f"Returning {len(filtered)} projects for category: {category}")
        return jsonify(filtered)
        
    except Exception as e:
        logger.error(f"Error in get_projects: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@projects_bp.route('/filters', methods=['GET'])
def get_filters():
    try:
        # Get unique categories from MongoDB
        categories = projects_collection.distinct("category")
        filters = ["All Blog"] + categories
        return jsonify(filters)
    except Exception as e:
        logger.error(f"Error in get_filters: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500