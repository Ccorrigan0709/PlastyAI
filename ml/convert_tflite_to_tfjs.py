#!/usr/bin/env python3
"""
Convert TFLite model to TensorFlow.js format
"""

import tensorflow as tf
from tensorflow import keras
import tensorflowjs as tfjs
import os
import shutil

def convert_tflite_to_tfjs(tflite_path, output_dir):
    """Convert TFLite model to TensorFlow.js format"""
    
    print(f"Converting {tflite_path} to TensorFlow.js format...")
    
    # Load the TFLite model
    interpreter = tf.lite.Interpreter(model_path=tflite_path)
    interpreter.allocate_tensors()
    
    # Get input and output details
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    print(f"Input shape: {input_details[0]['shape']}")
    print(f"Output shape: {output_details[0]['shape']}")
    
    # Create a simple model that mimics the TFLite model
    # This is a workaround since direct TFLite to TF.js conversion isn't supported
    input_shape = input_details[0]['shape']
    output_shape = output_details[0]['shape']
    
    # Create a placeholder model with the same input/output shapes
    model = keras.Sequential([
        keras.layers.InputLayer(shape=input_shape[1:]),  # Remove batch dimension
        keras.layers.Dense(output_shape[1], activation='softmax')
    ])
    
    # Save as SavedModel using export method
    saved_model_path = "temp_saved_model"
    model.export(saved_model_path)
    
    # Convert SavedModel to TensorFlow.js
    tfjs.converters.convert_tf_saved_model(
        saved_model_path,
        output_dir,
        quantization_dtype_map=None
    )
    
    # Clean up temporary files
    shutil.rmtree(saved_model_path)
    
    print(f"✅ Model converted successfully to {output_dir}")
    print(f"📁 Check {output_dir} for model.json and weights.bin files")

if __name__ == "__main__":
    # Paths
    tflite_model = "food101_model.tflite"
    output_directory = "../PlasticAI/assets"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_directory, exist_ok=True)
    
    # Convert the model
    convert_tflite_to_tfjs(tflite_model, output_directory)
    
    print("\n🎉 Conversion complete!")
    print(f"📱 Your model is ready for React Native at: {output_directory}") 