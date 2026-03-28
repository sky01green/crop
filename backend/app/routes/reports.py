"""
Health Report routes - View generated health reports.
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.prediction import Prediction
from app.models.report import HealthReport

reports_bp = Blueprint('reports', __name__)


@reports_bp.route('/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    """
    Get a health report by ID.
    Verifies the report belongs to the current user.
    
    Returns:
        200: { report, prediction }
        404: { message }
    """
    user_id = get_jwt_identity()
    
    report = HealthReport.query.get(report_id)
    if not report:
        return jsonify({'message': 'Report not found'}), 404
    
    # Verify ownership through the prediction
    prediction = Prediction.query.get(report.prediction_id)
    if not prediction or prediction.user_id != int(user_id):
        return jsonify({'message': 'Report not found'}), 404
    
    return jsonify({
        'report': report.to_dict(),
        'prediction': prediction.to_dict()
    }), 200


@reports_bp.route('/by-prediction/<int:prediction_id>', methods=['GET'])
@jwt_required()
def get_report_by_prediction(prediction_id):
    """
    Get the health report for a specific prediction.
    
    Returns:
        200: { report, prediction }
        404: { message }
    """
    user_id = get_jwt_identity()
    
    prediction = Prediction.query.filter_by(
        id=prediction_id, 
        user_id=int(user_id)
    ).first()
    
    if not prediction:
        return jsonify({'message': 'Prediction not found'}), 404
    
    if not prediction.report:
        return jsonify({'message': 'No report available for this prediction'}), 404
    
    return jsonify({
        'report': prediction.report.to_dict(),
        'prediction': prediction.to_dict()
    }), 200
