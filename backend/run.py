import sys
import os
import traceback

# Add current directory to path to allow running from either root or backend folder
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app import create_app

print("--- STARTING FLASK APPLICATION ---", flush=True)

try:
    print(f"Loading app with FLASK_ENV={os.environ.get('FLASK_ENV', 'development')}...", flush=True)
    app = create_app()
    print("Application successfully initialized.", flush=True)
except Exception as e:
    print(f"FATAL ERROR during application startup: {e}", flush=True)
    traceback.print_exc(file=sys.stdout)
    # Re-raise to ensure gunicorn sees it
    raise e

if __name__ == '__main__':
    # Default port 5000 for local development
    port = int(os.environ.get('PORT', 5000))
    print(f"Running locally on port {port}...", flush=True)
    app.run(debug=True, host='0.0.0.0', port=port)
