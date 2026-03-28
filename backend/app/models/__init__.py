"""
Database models package.
Import all models here so they are registered with SQLAlchemy.
"""
from app.models.user import User
from app.models.prediction import Prediction
from app.models.report import HealthReport

__all__ = ['User', 'Prediction', 'HealthReport']
