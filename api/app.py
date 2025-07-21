from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io
import base64
import os
import logging
import sys

# Add the ml directory to the path so we can import the plasticizer mapping
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ml'))

# Import the real plasticizer mapping
try:
    from plasticizer_mapping import plasticizer_map
    print("Successfully loaded real plasticizer data")
except ImportError:
    print("Warning: Could not load plasticizer mapping, using default values")
    plasticizer_map = {'default': 0}

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native app

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for model and labels
model = None
labels = []

def load_model():
    """Load the TFLite model and labels"""
    global model, labels
    
    try:
        # Load TFLite model
        model_path = os.path.join(os.path.dirname(__file__), 'model', 'food_classifier.tflite')
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        model = interpreter
        
        interpreter.allocate_tensors()

# 👇 Confirm what the model expects
        print("-- Input tensor info")
        print(interpreter.get_input_details()[0])
        print("-- Output tensor info")
        print(interpreter.get_output_details()[0])

        # Load labels
        labels_path = os.path.join(os.path.dirname(__file__), 'model', 'labels.txt')
        with open(labels_path, 'r') as f:
            labels = [line.strip() for line in f.readlines()]
        
        logger.info(f"Model loaded successfully with {len(labels)} labels")
        return True
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return False

def preprocess_image(image_data):
    """Preprocess image for model input using ImageNet normalization"""
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize((224, 224))
        
        # Convert to numpy array
        image_array = np.array(image, dtype=np.float32)
        
        # ImageNet normalization (mean/std)
        imagenet_mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        imagenet_std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        
        image_array = image_array / 255.0
        image_array = (image_array - imagenet_mean) / imagenet_std
        image_array = image_array.astype(np.float32)
        
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        return None

def predict_food(image_array):
    """Run inference on the model"""
    try:
        # Get input and output details
        input_details = model.get_input_details()
        output_details = model.get_output_details()
        
        # Debug: Print model input details
        print("Model input details:", input_details)
        print("Model output details:", output_details)
        print("Input image shape:", image_array.shape)
        print("Input image dtype:", image_array.dtype)
        print("Input image min/max:", image_array.min(), image_array.max())
        
        # Set input tensor
        model.set_tensor(input_details[0]['index'], image_array)
        
        # Run inference
        model.invoke()
        
        # Get output
        output = model.get_tensor(output_details[0]['index'])
        print("Raw model output:", output)
        print("Raw output shape:", output.shape)
        print("Raw output min/max:", output.min(), output.max())
        
        # Check if output needs softmax (if it's logits)
        if output.max() > 1.0 or output.min() < 0.0:
            print("Applying softmax to convert logits to probabilities")
            # Apply softmax to convert logits to probabilities
            exp_output = np.exp(output - np.max(output, axis=1, keepdims=True))
            output = exp_output / np.sum(exp_output, axis=1, keepdims=True)
            print("After softmax - min/max:", output.min(), output.max())
        
        # Get top 5 predictions
        top_indices = np.argsort(output[0])[-5:][::-1]
        print("Top 5 indices:", top_indices)
        print("Top 5 values:", output[0][top_indices])
        
        predictions = []
        for idx in top_indices:
            predictions.append({
                'label': labels[idx],
                'confidence': float(output[0][idx])
            })
        
        return predictions
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return None

# Real plasticizer data from the updated dataset
# The plasticizer_map is now imported from ml/plasticizer_mapping.py

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'labels_count': len(labels),
        'plasticizer_data_loaded': 'plasticizer_map' in globals()
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predict food type from uploaded image"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get image data from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        image_data = data['image']
        
        # Preprocess image using ImageNet normalization
        image_array = preprocess_image(image_data)
        if image_array is None:
            return jsonify({'error': 'Failed to preprocess image'}), 400
        print("min / max after preprocessing:", image_array.min(), image_array.max())
        print("dtype :", image_array.dtype)
        print("shape :", image_array.shape)
        
        # Run prediction
        predictions = predict_food(image_array)
        if predictions is None:
            return jsonify({'error': 'Failed to run prediction'}), 500
        
        # Get top prediction
        top_prediction = predictions[0]
        
        # Get plasticizer count for the predicted label (in nanograms per serving)
        plasticizer_count = plasticizer_map.get(top_prediction['label'], plasticizer_map.get('default', 0))
        
        # Determine if microplastics are likely present
        microplastics_detected = detect_microplastics(image_array, top_prediction)
        
        return jsonify({
            'predictions': predictions,
            'top_prediction': top_prediction,
            'plasticizer_count': plasticizer_count,  # Real data in ng/serving
            'microplastics_detected': microplastics_detected,
            'confidence': top_prediction['confidence'],
            'model_info': {
                'total_classes': len(labels),
                'preprocessing': 'ImageNet normalization (mean/std)',
                'input_shape': image_array.shape,
                'note': 'Low confidence scores may indicate model training issues'
            }
        })
        
    except Exception as e:
        logger.error(f"Error in predict endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def detect_microplastics(image_array, food_prediction):
    """
    Placeholder function for microplastics detection
    You can implement your own logic here based on your research
    """
    # This is a simple example - you should implement proper microplastics detection
    confidence = food_prediction['confidence']
    
    # For now, we'll use a simple heuristic
    # Foods with lower confidence might indicate contamination
    if confidence < 0.7:
        return {
            'detected': True,
            'confidence': 1.0 - confidence,
            'reason': 'Low food classification confidence may indicate contamination'
        }
    
    return {
        'detected': False,
        'confidence': 0.0,
        'reason': 'High confidence food classification'
    }

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    input_details = model.get_input_details()
    output_details = model.get_output_details()
    
    return jsonify({
    'input_shape': input_details[0]['shape'].tolist(),
    'output_shape': output_details[0]['shape'].tolist(),
    'labels_count': len(labels),
    'sample_labels': labels[:10]  # First 10 labels as example
})

if __name__ == '__main__':
    # Load model on startup
    if load_model():
        logger.info("API server starting...")
        app.run(host='0.0.0.0', port=5001, debug=False)
    else:
        logger.error("Failed to load model. Exiting.")
        exit(1) 