import sys
import traceback
from app import create_app

try:
    print("Starting Flask application...")
    app = create_app()
    print("Application successfully initialized.")
except Exception as e:
    print(f"FATAL ERROR during application startup: {e}")
    traceback.print_exc()
    # In case of failure, still provide an empty app instance or similar? 
    # No, gunicorn should see the error.
    raise e

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
