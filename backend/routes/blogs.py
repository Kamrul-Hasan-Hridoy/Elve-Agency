from flask import Blueprint, jsonify, request
from bson import ObjectId
from models import blogs_collection

blogs_bp = Blueprint("blogs_bp", __name__)

# Get all blogs
@blogs_bp.route("/blogs", methods=["GET"])
def get_blogs():
    try:
        blogs = list(blogs_collection.find({}, {
            "_id": 1,
            "title": 1,
            "description": 1,
            "image": 1,
            "category": 1,
            "date": 1,
            "read_time": 1,
            "content": 1,  # Include full content here
        }))
        for blog in blogs:
            blog["_id"] = str(blog["_id"])
        return jsonify(blogs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get single blog by ID
@blogs_bp.route("/blogs/<id>", methods=["GET"])
def get_blog(id):
    try:
        blog = blogs_collection.find_one({"_id": ObjectId(id)})
        if not blog:
            return jsonify({"error": "Blog not found"}), 404
        blog["_id"] = str(blog["_id"])
        return jsonify(blog)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create a new blog
@blogs_bp.route("/blogs", methods=["POST"])
def create_blog():
    try:
        data = request.json
        result = blogs_collection.insert_one({
            "title": data.get("title"),
            "category": data.get("category"),
            "description": data.get("description"),
            "image": data.get("image"),
            "date": data.get("date"),
            "read_time": data.get("read_time"),
            "content": data.get("content")
        })
        return jsonify({"message": "Blog created", "id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update blog
@blogs_bp.route("/blogs/<id>", methods=["PUT"])
def update_blog(id):
    try:
        data = request.json
        result = blogs_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {
                "title": data.get("title"),
                "category": data.get("category"),
                "description": data.get("description"),
                "image": data.get("image"),
                "date": data.get("date"),
                "read_time": data.get("read_time"),
                "content": data.get("content")
            }}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Blog not found"}), 404
        return jsonify({"message": "Blog updated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete blog
@blogs_bp.route("/blogs/<id>", methods=["DELETE"])
def delete_blog(id):
    try:
        result = blogs_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Blog not found"}), 404
        return jsonify({"message": "Blog deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
