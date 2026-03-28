"""
User model - stores registered user accounts.
Handles password hashing and verification.
"""
from datetime import datetime
from app import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship: One user has many predictions
    predictions = db.relationship(
        'Prediction', 
        backref='user', 
        lazy='dynamic',
        cascade='all, delete-orphan'
    )
    
    def set_password(self, password):
        """Hash and store the password. Never store plain text."""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Verify a password against the stored hash."""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to JSON-safe dictionary. NEVER include password_hash."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active,
            'total_predictions': self.predictions.count() if self.predictions else 0,
        }
    
    def __repr__(self):
        return f'<User {self.email}>'
