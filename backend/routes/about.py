from flask import Blueprint, jsonify
from models import about_collection

about_bp = Blueprint('about', __name__)

@about_bp.route('/about')
def get_about():
    try:
        about_data = about_collection.find_one()
        if about_data:
            # Convert ObjectId to string for JSON serialization
            about_data['_id'] = str(about_data['_id'])
            return jsonify(about_data)
        else:
            # Return default data if no about data exists
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
                        '/images/default1.png',
                        '/images/default2.png'
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