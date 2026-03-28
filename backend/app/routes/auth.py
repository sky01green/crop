"""
Authentication routes - Register, Login, Profile.
Uses JWT tokens for stateless authentication.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, 
    jwt_required, 
    get_jwt_identity,
    decode_token
)
from datetime import timedelta
from app import db
from app.models.user import User
from app.utils.validators import validate_email, validate_password

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user account.
    
    Request Body:
        {
            "name": "Farmer John",
            "email": "john@farm.com",
            "password": "securePassword123"
        }
    
    Returns:
        201: { message, token, user }
        400: { message } - validation error
        409: { message } - email already exists
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    # Validate required fields
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not name:
        return jsonify({'message': 'Name is required'}), 400
    
    if not validate_email(email):
        return jsonify({'message': 'Invalid email address'}), 400
    
    password_error = validate_password(password)
    if password_error:
        return jsonify({'message': password_error}), 400
    
    # Check if email already registered
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'An account with this email already exists'}), 409
    
    # Create user
    user = User(name=name, email=email)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    # Generate JWT token
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Registration successful',
        'token': token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login with email and password.
    
    Request Body:
        {
            "email": "john@farm.com",
            "password": "securePassword123"
        }
    
    Returns:
        200: { token, user }
        401: { message } - invalid credentials
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    # Check password (use same error for both cases to prevent email enumeration)
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    if not user.is_active:
        return jsonify({'message': 'Account is deactivated'}), 401
    
    # Generate JWT token
    token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """
    Get the currently logged-in user's profile.
    Requires a valid JWT token in the Authorization header.
    
    Returns:
        200: { user }
        401: if token is missing/invalid
    """
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({'user': user.to_dict()}), 200


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Request a password reset link.
    In a real app, this would send an email.
    
    Request Body:
        { "email": "john@farm.com" }
    """
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
        
    user = User.query.filter_by(email=email).first()
    
    # We return success even if user doesn't exist to prevent email enumeration
    # but for this demo, we'll return the token so the user can actually use it
    if user:
        # Create a short-lived token (15 mins) specifically for password reset
        reset_token = create_access_token(
            identity=str(user.id), 
            expires_delta=timedelta(minutes=15),
            additional_claims={"type": "password_reset"}
        )
        
        # Here you would send the email with the token
        return jsonify({
            'message': 'If an account exists with that email, a reset link has been sent.',
            'reset_token_demo': reset_token # Demo only!
        }), 200
    
    return jsonify({'message': 'If an account exists with that email, a reset link has been sent.'}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Reset password using a token.
    
    Request Body:
        { "token": "...", "new_password": "..." }
    """
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')
    
    if not token or not new_password:
        return jsonify({'message': 'Token and new password are required'}), 400
        
    password_error = validate_password(new_password)
    if password_error:
        return jsonify({'message': password_error}), 400
        
    try:
        # Decode and validate token manually since it's not in the header
        decoded = decode_token(token)
        
        # Check if it's the right type of token
        if decoded.get('sub') and decoded.get('type') == 'password_reset':
            user_id = decoded['sub']
            user = User.query.get(int(user_id))
            
            if not user:
                return jsonify({'message': 'Invalid reset token'}), 400
                
            user.set_password(new_password)
            db.session.commit()
            
            return jsonify({'message': 'Password has been reset successfully'}), 200
        else:
            return jsonify({'message': 'Invalid reset token type'}), 400
            
    except Exception as e:
        return jsonify({'message': f'Invalid or expired token: {str(e)}'}), 400
