"""
Application Factory Pattern.

This file creates and configures the Flask application.
All extensions (database, auth, etc.) are initialized here.
All route blueprints are registered here.
"""
import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Initialize extensions (created here, attached to app in create_app)
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()


def create_app(config_name=None):
    """
    Create and configure the Flask application.
    
    Args:
        config_name: 'development', 'production', or 'testing'
    
    Returns:
        Configured Flask app instance
    """
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Load configuration
    from config import config_map
    app.config.from_object(config_map.get(config_name, config_map['development']))
    
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Initialize extensions with this app
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register route blueprints
    from app.routes.auth import auth_bp
    from app.routes.predictions import predictions_bp
    from app.routes.reports import reports_bp
    from app.routes.users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(predictions_bp, url_prefix='/api/predictions')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    
    # Health check endpoint for Render
    @app.route('/api/health')
    def health_check():
        try:
            # Check database connection
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            return {'status': 'healthy', 'database': 'connected'}, 200
        except Exception as e:
            return {'status': 'unhealthy', 'error': str(e)}, 500
    
    # Register static file serving for uploads
    from flask import send_from_directory
    
    @app.route('/uploads/<filename>')
    def serve_upload(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    # Create database tables (for development without migrations)
    with app.app_context():
        # Import all models so SQLAlchemy knows about them
        from app.models import user, prediction, report  # noqa: F401
        db.create_all()
        
        # Load ML model if available
        try:
            from app.ml.model_loader import load_model
            model_path = app.config['ML_MODEL_PATH']
            if os.path.exists(model_path):
                app.config['ML_MODEL'] = load_model(model_path)
                print(f"OK: ML model loaded from {model_path}")
            else:
                app.config['ML_MODEL'] = None
                print(f"WARNING: ML model not found at {model_path}. Running in demo mode.")
        except Exception as e:
            app.config['ML_MODEL'] = None
            print(f"WARNING: Could not load ML model: {e}. Running in demo mode.")
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'message': 'Token has expired', 'error': 'token_expired'}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'message': 'Invalid token', 'error': 'invalid_token'}, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {'message': 'Missing authorization token', 'error': 'authorization_required'}, 401
    
    return app
