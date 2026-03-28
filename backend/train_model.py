"""
ML Model Training Script
=========================
Train a crop disease detection model using the PlantVillage dataset.

Prerequisites:
    1. Download the PlantVillage dataset from Kaggle:
       https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
    2. Extract it so you have a folder structure like:
       dataset/
         color/
           Apple___Apple_scab/
           Apple___Black_rot/
           ... (38 folders)
    3. Install TensorFlow: pip install tensorflow

Usage:
    python train_model.py --data_dir ./dataset/color --epochs 15

The trained model will be saved to ml_models/crop_disease_model.h5
"""
import os
import argparse
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau


# ============================================================
# Configuration
# ============================================================
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
NUM_CLASSES = 38  # PlantVillage has 38 classes
DEFAULT_EPOCHS = 15
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), 'ml_models', 'crop_disease_model.h5')


def create_data_generators(data_dir):
    """
    Create training and validation data generators with augmentation.
    
    Data augmentation helps the model generalize better by creating
    variations of the training images (rotation, flip, zoom, etc.)
    """
    # Training data: with augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,                # Normalize pixels to 0-1
        validation_split=0.2,          # 80% train, 20% validation
        rotation_range=20,             # Random rotation up to 20 degrees
        width_shift_range=0.2,         # Random horizontal shift
        height_shift_range=0.2,        # Random vertical shift
        shear_range=0.15,              # Random shear
        zoom_range=0.15,               # Random zoom
        horizontal_flip=True,          # Random horizontal flip
        fill_mode='nearest'            # Fill strategy for shifted pixels
    )
    
    # Validation data: NO augmentation, only rescale
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )
    
    # Load training images
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training',
        shuffle=True
    )
    
    # Load validation images
    val_generator = val_datagen.flow_from_directory(
        data_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )
    
    print(f"\n📊 Dataset Summary:")
    print(f"   Training samples: {train_generator.samples}")
    print(f"   Validation samples: {val_generator.samples}")
    print(f"   Number of classes: {len(train_generator.class_indices)}")
    print(f"   Classes: {list(train_generator.class_indices.keys())[:5]}... (showing first 5)")
    
    return train_generator, val_generator


def build_model():
    """
    Build the model using Transfer Learning with MobileNetV2.
    
    Transfer Learning means we use a model that was already trained
    on millions of images (ImageNet) and adapt it for our specific task.
    This gives us high accuracy even with a smaller dataset.
    
    MobileNetV2 is lightweight and fast - perfect for deployment.
    """
    # Load MobileNetV2 without the top classification layer
    base_model = MobileNetV2(
        weights='imagenet',       # Use pre-trained ImageNet weights
        include_top=False,        # Remove the original classification layer
        input_shape=(224, 224, 3) # Our image dimensions
    )
    
    # Freeze the base model weights (don't retrain them initially)
    base_model.trainable = False
    
    # Build our custom classification head
    model = Sequential([
        base_model,                                    # Pre-trained feature extractor
        GlobalAveragePooling2D(),                      # Reduce features to 1D vector
        Dense(256, activation='relu'),                 # Hidden layer for learning patterns
        Dropout(0.5),                                  # Prevent overfitting (50% dropout)
        Dense(128, activation='relu'),                 # Another hidden layer
        Dropout(0.3),                                  # Less dropout
        Dense(NUM_CLASSES, activation='softmax')        # Output: 38 class probabilities
    ])
    
    # Compile the model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("\n🏗️  Model Architecture:")
    model.summary()
    
    return model, base_model


def fine_tune_model(model, base_model):
    """
    Fine-tune the last few layers of the base model.
    This allows the model to adapt the pre-trained features
    specifically for crop disease detection.
    """
    # Unfreeze the last 30 layers of MobileNetV2
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False
    
    # Re-compile with a lower learning rate
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model


def train(data_dir, epochs):
    """Main training pipeline."""
    print("=" * 60)
    print("🌿 Crop Disease Detection Model Training")
    print("=" * 60)
    
    # Step 1: Prepare data
    print("\n📂 Step 1: Loading and preparing data...")
    train_gen, val_gen = create_data_generators(data_dir)
    
    # Step 2: Build model
    print("\n🏗️  Step 2: Building model with Transfer Learning...")
    model, base_model = build_model()
    
    # Step 3: Callbacks for training
    callbacks = [
        EarlyStopping(
            monitor='val_accuracy',
            patience=5,
            restore_best_weights=True,
            verbose=1
        ),
        ModelCheckpoint(
            MODEL_SAVE_PATH,
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Step 4: Initial training (frozen base)
    initial_epochs = min(epochs // 2, 5)
    print(f"\n🚀 Step 3: Initial training ({initial_epochs} epochs, base model frozen)...")
    history1 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=initial_epochs,
        callbacks=callbacks,
        verbose=1
    )
    
    # Step 5: Fine-tuning (partially unfrozen base)
    remaining_epochs = epochs - initial_epochs
    print(f"\n🔧 Step 4: Fine-tuning ({remaining_epochs} epochs, last 30 layers unfrozen)...")
    model = fine_tune_model(model, base_model)
    history2 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=remaining_epochs,
        callbacks=callbacks,
        verbose=1
    )
    
    # Step 6: Evaluate
    print("\n📊 Step 5: Final evaluation...")
    val_loss, val_accuracy = model.evaluate(val_gen, verbose=0)
    print(f"   Validation Loss: {val_loss:.4f}")
    print(f"   Validation Accuracy: {val_accuracy:.4f} ({val_accuracy * 100:.2f}%)")
    
    # Save class names mapping
    class_names = list(train_gen.class_indices.keys())
    class_file = os.path.join(os.path.dirname(MODEL_SAVE_PATH), 'class_names.txt')
    with open(class_file, 'w') as f:
        for name in class_names:
            f.write(f"{name}\n")
    
    print(f"\n✅ Model saved to: {MODEL_SAVE_PATH}")
    print(f"✅ Class names saved to: {class_file}")
    print(f"\n🎉 Training complete! Accuracy: {val_accuracy * 100:.2f}%")
    
    return model


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train crop disease detection model')
    parser.add_argument(
        '--data_dir', 
        type=str, 
        required=True,
        help='Path to PlantVillage dataset directory (the "color" folder)'
    )
    parser.add_argument(
        '--epochs', 
        type=int, 
        default=DEFAULT_EPOCHS,
        help=f'Number of training epochs (default: {DEFAULT_EPOCHS})'
    )
    
    args = parser.parse_args()
    
    if not os.path.isdir(args.data_dir):
        print(f"❌ Error: Directory not found: {args.data_dir}")
        print("Download the PlantVillage dataset from:")
        print("https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset")
        exit(1)
    
    # Create output directory
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    
    train(args.data_dir, args.epochs)
