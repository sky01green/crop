"""
Health Report model - stores the AI-generated health analysis
for each prediction. Includes treatment recommendations.
"""
from datetime import datetime
from app import db


class HealthReport(db.Model):
    __tablename__ = 'health_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    prediction_id = db.Column(
        db.Integer, 
        db.ForeignKey('predictions.id'), 
        nullable=False, 
        unique=True,
        index=True
    )
    
    # Report content
    severity = db.Column(db.String(20))  # none, mild, moderate, severe
    description = db.Column(db.Text)
    symptoms = db.Column(db.Text)
    causes = db.Column(db.Text)
    treatment = db.Column(db.Text)
    prevention = db.Column(db.Text)
    recommended_products = db.Column(db.Text)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to JSON-safe dictionary."""
        return {
            'id': self.id,
            'prediction_id': self.prediction_id,
            'severity': self.severity,
            'description': self.description,
            'symptoms': self.symptoms,
            'causes': self.causes,
            'treatment': self.treatment,
            'prevention': self.prevention,
            'recommended_products': self.recommended_products,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
    
    def __repr__(self):
        return f'<HealthReport {self.id} for Prediction {self.prediction_id}>'
