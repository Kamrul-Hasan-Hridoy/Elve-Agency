from flask import Blueprint, jsonify, request
from models import faqs_collection

faqs_bp = Blueprint('faqs', __name__)

@faqs_bp.route('/faqs', methods=['GET'])
def get_faqs():
    try:
        faqs = list(faqs_collection.find({}, {'_id': 0}))
        return jsonify(faqs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@faqs_bp.route('/admin/faqs', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_faqs():
    try:
        if request.method == 'GET':
            faqs = list(faqs_collection.find({}, {'_id': 0}))
            return jsonify(faqs)
        
        elif request.method == 'POST':
            data = request.json
            # Generate new ID
            last_faq = faqs_collection.find_one(sort=[("id", -1)])
            new_id = last_faq['id'] + 1 if last_faq else 1
            
            faq = {
                "id": new_id,
                "question": data['question'],
                "answer": data['answer'],
                "open": data.get('open', False)
            }
            
            faqs_collection.insert_one(faq)
            return jsonify({"message": "FAQ added successfully"})
        
        elif request.method == 'PUT':
            data = request.json
            faqs_collection.update_one(
                {"id": data['id']},
                {"$set": {
                    "question": data['question'],
                    "answer": data['answer'],
                    "open": data.get('open', False)
                }}
            )
            return jsonify({"message": "FAQ updated successfully"})
        
        elif request.method == 'DELETE':
            faq_id = request.args.get('id')
            faqs_collection.delete_one({"id": int(faq_id)})
            return jsonify({"message": "FAQ deleted successfully"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500