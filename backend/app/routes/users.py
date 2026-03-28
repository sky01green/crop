"""
User routes - Profile management.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User

users_bp = Blueprint('users', __name__)


@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    Update the current user's profile.
    
    Request Body:
        { "name": "New Name" }
    
    Returns:
        200: { message, user }
    """
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    
    if 'name' in data:
        name = data['name'].strip()
        if name:
            user.name = name
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200


@users_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    """
    Change the current user's password.
    
    Request Body:
        {
            "current_password": "old123",
            "new_password": "new456"
        }
    
    Returns:
        200: { message }
        400: { message } - validation error
        401: { message } - wrong current password
    """
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')
    
    if not user.check_password(current_password):
        return jsonify({'message': 'Current password is incorrect'}), 401
    
    if len(new_password) < 6:
        return jsonify({'message': 'New password must be at least 6 characters'}), 400
    
    user.set_password(new_password)
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200
