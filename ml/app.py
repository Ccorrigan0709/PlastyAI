from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
import io
from PIL import Image
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native

# Load the TFLite model
interpreter = None
labels = []

def load_model():
    """Load the TFLite model and labels"""
    global interpreter, labels
    
    # Load TFLite model
    model_path = 'food101_model.tflite'
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    
    # Load labels
    with open('labels.txt', 'r') as f:
        labels = [line.strip() for line in f.readlines()]
    
    print(f"✅ Model loaded with {len(labels)} classes")
    print(f"📊 Input shape: {interpreter.get_input_details()[0]['shape']}")
    print(f"📊 Output shape: {interpreter.get_output_details()[0]['shape']}")

def preprocess_image(image_data):
    """Preprocess image for model input"""
    # Decode base64 image
    image_bytes = base64.b64decode(image_data.split(',')[1])
    image = Image.open(io.BytesIO(image_bytes))
    
    # Resize to 224x224
    image = image.resize((224, 224))
    
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Convert to numpy array and normalize
    image_array = np.array(image, dtype=np.float32)
    image_array = image_array / 255.0
    
    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)
    
    return image_array

def get_microplastics_estimate(food_label, confidence):
    """Estimate microplastics based on food type"""
    microplastics_data = {
        'seafood': {'min': 8, 'max': 15},
        'salt': {'min': 5, 'max': 12},
        'beer': {'min': 4, 'max': 10},
        'honey': {'min': 3, 'max': 8},
        'chicken': {'min': 2, 'max': 6},
        'beef': {'min': 2, 'max': 5},
        'pork': {'min': 2, 'max': 5},
        'fruits': {'min': 0, 'max': 2},
        'vegetables': {'min': 0, 'max': 2},
        'grains': {'min': 0, 'max': 3}
    }
    
    # Determine food category
    label_lower = food_label.lower()
    category = 'low'
    
    if any(word in label_lower for word in ['fish', 'seafood', 'clam', 'crab', 'lobster', 'oyster', 'scallop', 'shrimp', 'tuna', 'salmon']):
        category = 'seafood'
    elif any(word in label_lower for word in ['apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'peach', 'pear', 'mango', 'kiwi']):
        category = 'fruits'
    elif any(word in label_lower for word in ['carrot', 'tomato', 'cucumber', 'lettuce', 'spinach', 'broccoli', 'cauliflower', 'onion', 'potato', 'corn']):
        category = 'vegetables'
    elif any(word in label_lower for word in ['bread', 'rice', 'pasta', 'noodle']):
        category = 'grains'
    elif 'chicken' in label_lower:
        category = 'chicken'
    elif any(word in label_lower for word in ['beef', 'steak', 'burger']):
        category = 'beef'
    elif 'pork' in label_lower:
        category = 'pork'
    
    range_data = microplastics_data.get(category, {'min': 1, 'max': 4})
    base_estimate = np.random.uniform(range_data['min'], range_data['max'])
    confidence_multiplier = 0.5 + (confidence * 0.5)
    
    return int(base_estimate * confidence_multiplier)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': interpreter is not None,
        'num_classes': len(labels)
    })

@app.route('/classify', methods=['POST'])
def classify_food():
    """Classify food image and return predictions"""
    try:
        # Get image data from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        image_data = data['image']
        
        # Preprocess image
        input_tensor = preprocess_image(image_data)
        
        # Set input tensor
        interpreter.set_tensor(interpreter.get_input_details()[0]['index'], input_tensor)
        
        # Run inference
        interpreter.invoke()
        
        # Get output tensor
        output_tensor = interpreter.get_tensor(interpreter.get_output_details()[0]['index'])
        
        # Get top 5 predictions
        top_indices = np.argsort(output_tensor[0])[-5:][::-1]
        
        results = []
        for i, idx in enumerate(top_indices):
            confidence = float(output_tensor[0][idx])
            label = labels[idx]
            microplastics = get_microplastics_estimate(label, confidence)
            
            results.append({
                'label': label,
                'confidence': confidence,
                'index': int(idx),
                'microplastics_count': microplastics
            })
        
        return jsonify({
            'success': True,
            'predictions': results,
            'top_prediction': results[0]
        })
        
    except Exception as e:
        print(f"Error during classification: {str(e)}")
        return jsonify({'error': 'Classification failed', 'details': str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'message': 'PlastyAI Food Classification API',
        'endpoints': {
            'health': '/health',
            'classify': '/classify (POST)'
        },
        'model_status': {
            'loaded': interpreter is not None,
            'classes': len(labels)
        }
    })

if __name__ == '__main__':
    # Load model on startup
    load_model()
    
    # Get port from environment variable (for Heroku)
    port = int(os.environ.get('PORT', 5000))
    
    print(f"🚀 Starting PlastyAI API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False) 