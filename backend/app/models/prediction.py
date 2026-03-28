"""
Prediction model - stores each disease detection result.
Links to the user who made it and the health report generated.
"""
from datetime import datetime
from app import db


class Prediction(db.Model):
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Image info
    image_filename = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(500))
    original_filename = db.Column(db.String(255))
    
    # Prediction results
    predicted_class = db.Column(db.String(100), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    is_healthy = db.Column(db.Boolean, default=False)
    disease_name = db.Column(db.String(200))
    crop_name = db.Column(db.String(100))
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Relationship: One prediction has one report
    report = db.relationship(
        'HealthReport', 
        backref='prediction', 
        uselist=False,
        cascade='all, delete-orphan'
    )
    
    def to_dict(self):
        """Convert to JSON-safe dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_url': self.image_url,
            'original_filename': self.original_filename,
            'predicted_class': self.predicted_class,
            'confidence': round(self.confidence * 100, 2),  # Convert to percentage
            'is_healthy': self.is_healthy,
            'disease_name': self.disease_name,
            'crop_name': self.crop_name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'has_report': self.report is not None,
        }
    
    def __repr__(self):
        return f'<Prediction {self.id}: {self.predicted_class} ({self.confidence:.2%})>'
