"""
Disease Predictor - Runs the AI model on preprocessed images
and returns structured prediction results.
"""
import random
import numpy as np
from app.ml.preprocessor import preprocess_image
from app.ml.model_loader import CLASS_NAMES


def parse_class_name(predicted_class):
    """
    Parse the class name into crop name and disease name.
    Example: 'Tomato___Early_blight' -> ('Tomato', 'Early blight')
    Example: 'Tomato___healthy' -> ('Tomato', None)
    """
    parts = predicted_class.split('___')
    crop_name = parts[0].replace('_', ' ').replace(',', ',')
    
    if len(parts) > 1:
        disease_part = parts[1]
        is_healthy = 'healthy' in disease_part.lower()
        disease_name = None if is_healthy else disease_part.replace('_', ' ')
    else:
        is_healthy = False
        disease_name = 'Unknown'
    
    return crop_name, disease_name, is_healthy


def predict_disease(model, image_path):
    """
    Run disease prediction on an image.
    
    If no ML model is loaded (demo mode), returns a random
    prediction for testing purposes.
    
    Args:
        model: Loaded Keras model (or None for demo mode)
        image_path: Path to the uploaded image
    
    Returns:
        dict with keys: class, confidence, crop_name, disease_name, is_healthy
    """
    if model is not None:
        # ---- Real prediction with loaded model ----
        processed_image = preprocess_image(image_path)
        predictions = model.predict(processed_image, verbose=0)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_index])
        predicted_class = CLASS_NAMES[predicted_index]
    else:
        # ---- Demo mode: simulate a prediction ----
        predicted_class = random.choice(CLASS_NAMES)
        confidence = random.uniform(0.75, 0.99)
    
    crop_name, disease_name, is_healthy = parse_class_name(predicted_class)
    
    return {
        'class': predicted_class,
        'confidence': confidence,
        'crop_name': crop_name,
        'disease_name': disease_name,
        'is_healthy': is_healthy,
    }
