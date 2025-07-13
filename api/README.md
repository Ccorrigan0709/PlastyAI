# PlastyAI Flask API

This Flask API serves the TensorFlow Lite model for food classification and microplastics detection.

## Features

- Food classification using TFLite model
- Image preprocessing and inference
- Microplastics detection (placeholder implementation)
- RESTful API endpoints
- CORS enabled for React Native integration

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API and model loading status.

### Model Information
```
GET /model-info
```
Returns information about the loaded model including input/output shapes and labels.

### Prediction
```
POST /predict
```
Accepts a base64 encoded image and returns food predictions and microplastics detection.

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

**Response:**
```json
{
  "predictions": [
    {
      "label": "apple",
      "confidence": 0.95
    }
  ],
  "top_prediction": {
    "label": "apple",
    "confidence": 0.95
  },
  "microplastics_detected": {
    "detected": false,
    "confidence": 0.0,
    "reason": "High confidence food classification"
  },
  "confidence": 0.95
}
```

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the API:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Railway Deployment

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize and deploy:
```bash
railway init
railway up
```

## Model Files

The API expects the following files in the `model/` directory:
- `food_classifier.tflite` - The TensorFlow Lite model
- `labels.txt` - Text file with food labels (one per line)

## Integration with React Native

The API is designed to work seamlessly with the React Native app. The React Native app can:

1. Take photos using the camera
2. Convert images to base64
3. Send POST requests to `/predict`
4. Display results to the user

## Environment Variables

- `PORT` - Port number (default: 5000)
- Railway will automatically set the PORT environment variable

## Notes

- The microplastics detection is currently a placeholder implementation
- You can enhance the `detect_microplastics()` function with your own logic
- The model expects 224x224 RGB images
- Images are automatically resized and normalized 