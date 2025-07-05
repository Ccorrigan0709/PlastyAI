# Heroku Deployment Guide for PlastyAI API

## Overview
This guide will help you deploy your Flask API with the TFLite model to Heroku.

## Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

## Files Structure
```
ml/
├── app.py              # Flask API
├── requirements.txt    # Python dependencies
├── Procfile           # Heroku process file
├── runtime.txt        # Python version
├── food101_model.tflite  # Your trained model
└── labels.txt         # Food labels
```

## Deployment Steps

### 1. Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
cd ml
heroku create your-plastyai-api
```

### 4. Add Buildpacks (if needed)
```bash
heroku buildpacks:add heroku/python
```

### 5. Deploy to Heroku
```bash
git add .
git commit -m "Initial API deployment"
git push heroku main
```

### 6. Check Deployment
```bash
heroku logs --tail
```

### 7. Test Your API
```bash
# Get your app URL
heroku info

# Test health endpoint
curl https://your-app-name.herokuapp.com/health
```

## API Endpoints

### Health Check
```
GET /health
```
Returns API status and model information.

### Food Classification
```
POST /classify
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

Returns:
```json
{
  "success": true,
  "predictions": [
    {
      "label": "apple_pie",
      "confidence": 0.95,
      "index": 0,
      "microplastics_count": 3
    }
  ],
  "top_prediction": {
    "label": "apple_pie",
    "confidence": 0.95,
    "index": 0,
    "microplastics_count": 3
  }
}
```

## React Native Integration

### Update APIService.js
```javascript
// Replace localhost with your Heroku URL
this.baseURL = 'https://your-app-name.herokuapp.com';
```

### Test Connection
```javascript
// Test API health
const health = await APIService.checkHealth();
console.log('API Status:', health);
```

## Troubleshooting

### Common Issues

1. **Model Loading Error**
   - Check if `food101_model.tflite` and `labels.txt` are in the root directory
   - Verify file permissions

2. **Memory Issues**
   - Heroku has memory limits
   - Consider model optimization or upgrading dyno

3. **Timeout Issues**
   - Increase timeout settings
   - Optimize image preprocessing

### Useful Commands
```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# Check app status
heroku ps

# Open app in browser
heroku open
```

## Performance Optimization

### 1. Model Optimization
- Quantize your TFLite model
- Use smaller input sizes if possible

### 2. Image Optimization
- Compress images before sending
- Use appropriate quality settings

### 3. Caching
- Implement response caching
- Cache model predictions

## Security Considerations

### 1. Rate Limiting
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)
```

### 2. Input Validation
- Validate image format and size
- Sanitize input data

### 3. CORS Configuration
```python
CORS(app, origins=['https://your-react-native-app.com'])
```

## Monitoring

### 1. Heroku Metrics
- Monitor dyno usage
- Check response times
- Track error rates

### 2. Application Logs
```bash
heroku logs --tail
```

### 3. Health Checks
- Set up automated health checks
- Monitor API availability

## Cost Optimization

### 1. Dyno Types
- Use appropriate dyno size
- Scale down during low usage

### 2. Add-ons
- Consider using Heroku add-ons for monitoring
- Use free tier when possible

## Next Steps

1. **Deploy your API** following the steps above
2. **Update React Native app** with the new API URL
3. **Test the integration** thoroughly
4. **Monitor performance** and optimize as needed
5. **Add security measures** for production use

## Support

If you encounter issues:
1. Check Heroku logs: `heroku logs --tail`
2. Verify all files are committed
3. Check Heroku documentation
4. Consider upgrading dyno if needed 