"""
Prediction routes - Upload image and get AI disease prediction.
This is the core feature of the application.
"""
import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import db
from app.models.prediction import Prediction
from app.ml.predictor import predict_disease
from app.ml.report_generator import generate_health_report

predictions_bp = Blueprint('predictions', __name__)


def allowed_file(filename):
    """Check if the file extension is allowed."""
    return (
        '.' in filename and 
        filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']
    )


@predictions_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    """
    Upload a crop leaf image and get disease prediction.
    
    Request:
        Content-Type: multipart/form-data
        Body: image file in 'image' field
    
    Returns:
        201: { prediction_id, prediction, report }
        400: { message } - no file or invalid file
        500: { message } - prediction failed
    """
    user_id = get_jwt_identity()
    
    # ---- Validate file upload ----
    if 'image' not in request.files:
        return jsonify({'message': 'No image file provided. Send a file with key "image"'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        allowed = ', '.join(current_app.config['ALLOWED_EXTENSIONS'])
        return jsonify({'message': f'Invalid file type. Allowed: {allowed}'}), 400
    
    # ---- Save the uploaded file ----
    original_filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
    upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(upload_path)
    
    try:
        # ---- Run AI prediction ----
        model = current_app.config.get('ML_MODEL')
        result = predict_disease(model, upload_path)
        
        # ---- Save prediction to database ----
        prediction = Prediction(
            user_id=int(user_id),
            image_filename=unique_filename,
            image_url=f"/uploads/{unique_filename}",
            original_filename=original_filename,
            predicted_class=result['class'],
            confidence=result['confidence'],
            is_healthy=result['is_healthy'],
            disease_name=result['disease_name'],
            crop_name=result['crop_name']
        )
        db.session.add(prediction)
        db.session.commit()
        
        # ---- Generate health report ----
        report = generate_health_report(prediction)
        db.session.add(report)
        db.session.commit()
        
        return jsonify({
            'message': 'Prediction successful',
            'prediction_id': prediction.id,
            'prediction': prediction.to_dict(),
            'report': report.to_dict()
        }), 201
        
    except Exception as e:
        # Clean up uploaded file on error
        if os.path.exists(upload_path):
            os.remove(upload_path)
        db.session.rollback()
        return jsonify({'message': f'Prediction failed: {str(e)}'}), 500


@predictions_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """
    Get all predictions for the current user, newest first.
    
    Query Params:
        page (int): Page number (default 1)
        per_page (int): Items per page (default 20, max 100)
    
    Returns:
        200: { predictions, total, page, per_page, pages }
    """
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    pagination = Prediction.query.filter_by(
        user_id=int(user_id)
    ).order_by(
        Prediction.created_at.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'predictions': [p.to_dict() for p in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'pages': pagination.pages,
    }), 200


@predictions_bp.route('/<int:prediction_id>', methods=['GET'])
@jwt_required()
def get_prediction(prediction_id):
    """
    Get a single prediction with its health report.
    Only the owner can view their predictions.
    
    Returns:
        200: { prediction, report }
        404: { message } - not found
    """
    user_id = get_jwt_identity()
    prediction = Prediction.query.filter_by(
        id=prediction_id, 
        user_id=int(user_id)
    ).first()
    
    if not prediction:
        return jsonify({'message': 'Prediction not found'}), 404
    
    return jsonify({
        'prediction': prediction.to_dict(),
        'report': prediction.report.to_dict() if prediction.report else None
    }), 200


@predictions_bp.route('/<int:prediction_id>', methods=['DELETE'])
@jwt_required()
def delete_prediction(prediction_id):
    """
    Delete a prediction and its associated report and image.
    Only the owner can delete their predictions.
    
    Returns:
        200: { message }
        404: { message } - not found
    """
    user_id = get_jwt_identity()
    prediction = Prediction.query.filter_by(
        id=prediction_id, 
        user_id=int(user_id)
    ).first()
    
    if not prediction:
        return jsonify({'message': 'Prediction not found'}), 404
    
    # Delete the image file
    image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], prediction.image_filename)
    if os.path.exists(image_path):
        os.remove(image_path)
    
    # Delete from database (cascades to report)
    db.session.delete(prediction)
    db.session.commit()
    
    return jsonify({'message': 'Prediction deleted successfully'}), 200


@predictions_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """
    Get prediction statistics for the current user's dashboard.
    
    Returns:
        200: { total_scans, healthy_count, diseased_count, crops_scanned }
    """
    user_id = get_jwt_identity()
    predictions = Prediction.query.filter_by(user_id=int(user_id)).all()
    
    total = len(predictions)
    healthy = sum(1 for p in predictions if p.is_healthy)
    diseased = total - healthy
    crops = list(set(p.crop_name for p in predictions if p.crop_name))
    
    return jsonify({
        'total_scans': total,
        'healthy_count': healthy,
        'diseased_count': diseased,
        'crops_scanned': crops,
        'unique_crops': len(crops),
    }), 200
