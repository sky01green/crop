"""
Application configuration for different environments.
Reads sensitive values from environment variables.
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


def _build_db_url():
    """
    Build and auto-fix the database URL for production (Supabase + Render).
    Handles:
      - postgres:// → postgresql:// prefix
      - IPv6 direct host → IPv4 pooler hostname
      - port 5432 → 6543 (pooler)
      - username 'postgres' → 'postgres.PROJECT_REF' (required by Supabase pooler)
      - sslmode=require (required by Supabase)
      - Safe re-encoding of special characters in password
    """
    raw_url = os.environ.get('DATABASE_URL')
    if not raw_url:
        return None

    # Standardize prefix for SQLAlchemy 2.0+
    if raw_url.startswith("postgres://"):
        raw_url = raw_url.replace("postgres://", "postgresql://", 1)

    if "supabase" not in raw_url:
        return raw_url  # Non-Supabase DB, return as-is

    try:
        from urllib.parse import urlparse, quote_plus

        parsed = urlparse(raw_url.strip())
        username = (parsed.username or "postgres").strip()
        password = (parsed.password or "").strip()
        host = (parsed.hostname or "").strip()
        port = parsed.port or 5432
        dbname = (parsed.path or "/postgres").lstrip("/") or "postgres"

        project_ref = None

        # Case 1: Direct connection host → db.PROJECT_REF.supabase.co (IPv6, blocked on Render)
        if host.startswith("db.") and "supabase.co" in host:
            parts = host.split(".")
            if len(parts) >= 3:
                project_ref = parts[1]
                pooler_host = os.environ.get(
                    "SUPABASE_POOLER_HOST",
                    f"aws-1-ap-southeast-1.pooler.supabase.com"
                )
                host = pooler_host
                port = 6543

        # Case 2: Already on pooler hostname
        elif "pooler.supabase.com" in host:
            port = 6543
            # Override host if SUPABASE_POOLER_HOST is set (fixes aws-0 vs aws-1 issues)
            override_host = os.environ.get("SUPABASE_POOLER_HOST")
            if override_host:
                host = override_host
            # Extract project_ref from username if already set
            if "." in username:
                project_ref = username.split(".", 1)[1]
            else:
                # Try explicit env var
                project_ref = os.environ.get("SUPABASE_PROJECT_REF")

        # Fix username: Supabase pooler requires postgres.PROJECT_REF
        if project_ref and "." not in username:
            username = f"postgres.{project_ref}"
        elif not project_ref and "." not in username:
            # Last resort: use SUPABASE_PROJECT_REF env var
            project_ref = os.environ.get("SUPABASE_PROJECT_REF")
            if project_ref:
                username = f"postgres.{project_ref}"

        # Re-encode password safely (handles @, #, : etc.)
        safe_password = quote_plus(password)

        # Build the final clean URL
        final_url = (
            f"postgresql://{username}:{safe_password}"
            f"@{host}:{port}/{dbname}?sslmode=require"
        )

        print(f"DB: Connecting to {host}:{port} as {username}", flush=True)
        return final_url

    except Exception as e:
        print(f"WARNING: Could not auto-fix DATABASE_URL: {e}. Using raw URL.", flush=True)
        return raw_url


class Config:
    """Base configuration shared across all environments."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-change-in-production')

    # Database - auto-fixed for Supabase/Render compatibility
    SQLALCHEMY_DATABASE_URI = (
        _build_db_url() or
        f'sqlite:///{os.path.join(BASE_DIR, "app.db")}'
    )
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
