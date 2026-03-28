FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads ml_models

# Expose port with default 7860 for free tiers like Hugging Face
ENV PORT=7860
EXPOSE $PORT

# Run with gunicorn for production (reads the $PORT environment variable)
CMD gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 run:app
