# TensorFlow.js Integration for PlastyAI

## Overview
This document explains how TensorFlow.js is integrated into the PlastyAI React Native app for food classification and microplastics detection.

## Architecture

### Current Setup
- **TensorFlow.js React Native**: Core ML framework for mobile
- **CPU Backend**: Optimized for React Native performance
- **Placeholder Model**: Simple neural network for testing
- **302-Class Labels**: Combined Food-101 + Fruits360 datasets

### File Structure
```
src/
├── services/
│   └── TensorFlowService.js    # Main ML service
└── screens/
    └── CameraScreen.jsx        # Updated with ML integration
```

## Components

### 1. TensorFlowService.js
**Location**: `src/services/TensorFlowService.js`

**Key Features**:
- ✅ TensorFlow.js initialization
- ✅ Model loading and management
- ✅ Image preprocessing (224x224, normalization)
- ✅ Food classification (top 5 predictions)
- ✅ Microplastics estimation based on food type
- ✅ Memory management (tensor disposal)

**Methods**:
```javascript
// Initialize the service
await TensorFlowService.initialize()

// Classify food image
const results = await TensorFlowService.classifyFood(imageUri)

// Get microplastics estimate
const count = TensorFlowService.getMicroplasticsEstimate(foodLabel, confidence)
```

### 2. CameraScreen.jsx
**Location**: `src/screens/CameraScreen.jsx`

**Updates**:
- ✅ TensorFlow service initialization on mount
- ✅ Real-time food classification
- ✅ Microplastics detection
- ✅ Results display and navigation
- ✅ Error handling and user feedback

## Current Implementation

### Placeholder Model
The current implementation uses a simple placeholder model for testing:
```javascript
// Simple 3-layer neural network
- Input: 224x224x3 flattened (150,528 features)
- Hidden: 128 units (ReLU + Dropout)
- Hidden: 64 units (ReLU + Dropout)  
- Output: 302 units (Softmax)
```

### Food Labels (302 Classes)
1. **Food-101 Dataset** (101 classes): apple_pie, baby_back_ribs, etc.
2. **Fruits360 Dataset** (131 classes): Apple Braeburn, Apple Crimson Snow, etc.

### Microplastics Estimation
Based on food categories:
- **High**: Seafood (8-15 particles)
- **Medium**: Meat (2-6 particles)  
- **Low**: Fruits/Vegetables (0-2 particles)

## Next Steps for Production

### 1. Load Your Trained Model
Replace the placeholder model with your actual trained model:

```javascript
// In TensorFlowService.js
async loadModel() {
  // Load your actual .tflite or .json model
  this.model = await tf.loadLayersModel('path/to/your/model.json');
}
```

### 2. Bundle Model Files
Add your model files to the React Native bundle:
```
assets/
├── model.json
├── weights.bin
└── labels.txt
```

### 3. Optimize Performance
- Use TensorFlow Lite for better mobile performance
- Implement model quantization
- Add caching for repeated classifications

### 4. Enhanced Microplastics Database
Replace the simple estimation with a comprehensive database:
```javascript
const microplasticsDatabase = {
  'apple_pie': { particles: 3, confidence: 0.8 },
  'grilled_salmon': { particles: 12, confidence: 0.9 },
  // ... 302 entries
};
```

## Testing

### Current Test Flow
1. Open app → TensorFlow initializes
2. Take photo → Image preprocessing
3. Classification → Top 5 predictions
4. Microplastics estimation → Based on food type
5. Results display → User feedback

### Debug Information
Check console logs for:
- TensorFlow initialization status
- Model loading progress
- Classification results
- Memory usage

## Dependencies

### Required Packages
```json
{
  "@tensorflow/tfjs": "^4.22.0",
  "@tensorflow/tfjs-react-native": "^1.0.0",
  "@tensorflow/tfjs-backend-cpu": "^4.22.0",
  "@tensorflow/tfjs-backend-webgl": "^4.22.0"
}
```

### Installation Notes
- Use `--legacy-peer-deps` for compatibility
- Ensure React Native version compatibility
- Test on both iOS and Android

## Performance Considerations

### Memory Management
- TensorFlow.js automatically manages GPU memory
- Manual disposal of tensors to prevent leaks
- Model loading happens once on app start

### Optimization Tips
- Use CPU backend for consistent performance
- Resize images to 224x224 before processing
- Batch predictions when possible
- Cache classification results

## Troubleshooting

### Common Issues
1. **Initialization fails**: Check TensorFlow.js version compatibility
2. **Model loading errors**: Verify model file paths and format
3. **Memory issues**: Ensure proper tensor disposal
4. **Performance slow**: Consider model quantization

### Debug Commands
```javascript
// Check TensorFlow status
console.log('TF Ready:', tf.ready());

// Check backend
console.log('Backend:', tf.getBackend());

// Check model
console.log('Model loaded:', !!this.model);
```

## Future Enhancements

### Planned Features
- [ ] Real TFLite model integration
- [ ] Offline model updates
- [ ] Batch processing for multiple images
- [ ] Advanced microplastics detection algorithms
- [ ] User feedback for model improvement

### Research Areas
- Model compression techniques
- Real-time video processing
- Multi-modal analysis (image + text)
- Personalized microplastics tracking 