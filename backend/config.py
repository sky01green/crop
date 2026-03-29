"""
Application configuration for different environments.
Reads sensitive values from environment variables.
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    """Base configuration shared across all environments."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-change-in-production')
    
    # Database - defaults to local SQLite for easy setup, use PostgreSQL in production
    _db_url = os.environ.get('DATABASE_URL')
    if _db_url:
        # Standardize prefix for SQLAlchemy 2.0+
        if _db_url.startswith("postgres://"):
            _db_url = _db_url.replace("postgres://", "postgresql://", 1)
        
        # If the URL is for Supabase, ensure it uses the connection pooler port (6543)
        # to avoid "Network unreachable" errors on port 5432 in some production environments
        if "supabase.co" in _db_url:
            if ":5432" in _db_url:
                _db_url = _db_url.replace(":5432", ":6543")
            
            # Ensure SSL mode is required for Supabase
            if "sslmode=" not in _db_url:
                _db_url += "?sslmode=require" if "?" not in _db_url else "&sslmode=require"

    SQLALCHEMY_DATABASE_URI = _db_url or f'sqlite:///{os.path.join(BASE_DIR, "app.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Authentication
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    
    # File Uploads
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    
    # ML Model
    ML_MODEL_PATH = os.path.join(BASE_DIR, 'ml_models', 'trained_model.h5')


class DevelopmentConfig(Config):
    """Development configuration with debug enabled."""
    DEBUG = True
    

class ProductionConfig(Config):
    """Production configuration with debug disabled."""
    DEBUG = False
    # In production, DATABASE_URL should point to PostgreSQL (e.g., Supabase)


class TestingConfig(Config):
    """Testing configuration with in-memory database."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


# Map config names to classes
config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
}
