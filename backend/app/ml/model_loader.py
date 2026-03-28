"""
ML Model Loader - Loads the trained TensorFlow/Keras model.
The model is loaded once at startup and reused for all predictions.
"""

# All 38 classes from the PlantVillage dataset
CLASS_NAMES = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites_Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy',
]


import os
import logging

# Singleton for the loaded model
_model = None

def load_model(model_path):
    """
    Load a trained Keras model from disk.
    
    Args:
        model_path: Path to the .h5 or SavedModel file
    
    Returns:
        Loaded Keras model ready for inference
    """
    import tensorflow as tf
    import numpy as np
    
    logging.info(f"Loading ML model from {model_path}...")
    try:
        model = tf.keras.models.load_model(model_path)
        # Warm up the model with a dummy prediction
        dummy = np.zeros((1, 128, 128, 3), dtype=np.float32)
        model.predict(dummy, verbose=0)
        logging.info("ML model loaded and warmed up successfully.")
        return model
    except Exception as e:
        logging.error(f"Failed to load ML model: {e}")
        return None

def get_model():
    """
    Retrieve the ML model, loading it lazily if not already loaded.
    Uses the path from config.
    """
    global _model
    if _model is not None:
        return _model
    
    from flask import current_app
    model_path = current_app.config.get('ML_MODEL_PATH')
    
    if os.path.exists(model_path):
        _model = load_model(model_path)
    else:
        logging.warning(f"ML model file not found at {model_path}")
        _model = None
        
    return _model
