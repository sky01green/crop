"""
Image Preprocessor - Prepares uploaded images for the AI model.
Handles resizing, normalization, and format conversion.
"""
import numpy as np
from PIL import Image

# Model expects 128x128 pixel images
IMG_SIZE = (128, 128)


def preprocess_image(image_path):
    """
    Load and preprocess an image for model prediction.
    
    Steps:
        1. Open the image file
        2. Convert to RGB (in case it's RGBA or grayscale)
        3. Resize to 128x128 pixels
        4. Convert to numpy array
        5. Normalize pixel values from 0-255 to 0-1
        6. Add batch dimension (model expects batch of images)
    
    Args:
        image_path: Path to the image file
    
    Returns:
        numpy array of shape (1, 128, 128, 3) with values 0-1
    """
    # Open and convert to RGB
    image = Image.open(image_path).convert('RGB')
    
    # Resize to model's expected input size
    image = image.resize(IMG_SIZE, Image.LANCZOS)
    
    # Convert to numpy array and normalize
    img_array = np.array(image, dtype=np.float32) / 255.0
    
    # Add batch dimension: (224, 224, 3) -> (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array
