# PlastyAI Deployment Guide

This guide will help you deploy your Flask API to Railway and integrate it with your React Native app.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: For version control
3. **Node.js**: For Railway CLI
4. **Python**: For local testing

## Step 1: Prepare Your Repository

1. **Initialize Git** (if not already done):
```bash
cd /Users/connorcorrigan/Desktop/PlastyAI3
git init
git add .
git commit -m "Initial commit with Flask API and React Native app"
```

2. **Create GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code to GitHub:
```bash
git remote add origin https://github.com/yourusername/plastyai.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Flask API to Railway

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Navigate to API Directory**:
```bash
cd api
```

4. **Initialize Railway Project**:
```bash
railway init
```

5. **Deploy to Railway**:
```bash
railway up
```

6. **Get Your Railway URL**:
```bash
railway domain
```

## Step 3: Update React Native App

1. **Update API URL** in `PlasticAI/src/services/api.js`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000'  // Local development
  : 'https://your-railway-app.railway.app'; // Replace with your Railway URL
```

2. **Test the Integration**:
   - Run your React Native app
   - Take a photo and test the API integration

## Step 4: Environment Variables (Optional)

If you need to set environment variables in Railway:

1. **Go to Railway Dashboard**
2. **Select your project**
3. **Go to Variables tab**
4. **Add any required environment variables**

## Step 5: Monitoring and Logs

1. **View Logs**:
```bash
railway logs
```

2. **Monitor Performance**:
   - Use Railway dashboard to monitor CPU, memory usage
   - Check response times and error rates

## Step 6: Testing Your Deployment

1. **Test Health Endpoint**:
```bash
curl https://your-railway-app.railway.app/health
```

2. **Test Model Info**:
```bash
curl https://your-railway-app.railway.app/model-info
```

3. **Test Prediction** (with a sample image):
```bash
curl -X POST https://your-railway-app.railway.app/predict \
  -H "Content-Type: application/json" \
  -d '{"image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."}'
```

## Troubleshooting

### Common Issues:

1. **Model Loading Errors**:
   - Check that `food_classifier.tflite` and `labels.txt` are in the `api/model/` directory
   - Verify file permissions

2. **Memory Issues**:
   - Railway free tier has memory limits
   - Consider upgrading if you encounter memory errors

3. **CORS Errors**:
   - Ensure CORS is properly configured in `app.py`
   - Check that your React Native app is using the correct API URL

4. **Image Processing Errors**:
   - Verify image format (JPEG/PNG)
   - Check image size limits

### Debug Commands:

```bash
# Check Railway status
railway status

# View recent logs
railway logs --tail

# Restart service
railway service restart

# Check environment variables
railway variables
```

## Cost Optimization

1. **Free Tier Limits**:
   - Railway free tier includes 500 hours/month
   - Monitor usage in Railway dashboard

2. **Scaling**:
   - Upgrade to paid plan for more resources
   - Consider auto-scaling for production use

## Security Considerations

1. **API Keys**: Don't commit sensitive data to Git
2. **Rate Limiting**: Consider implementing rate limiting for production
3. **Input Validation**: Validate all image inputs
4. **HTTPS**: Railway provides HTTPS by default

## Next Steps

1. **Enhance Microplastics Detection**: Implement more sophisticated detection algorithms
2. **Add Authentication**: Implement user authentication if needed
3. **Database Integration**: Add database for storing analysis results
4. **Analytics**: Add analytics to track usage patterns
5. **Mobile App Store**: Prepare for app store deployment

## Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Flask Documentation**: [flask.palletsprojects.com](https://flask.palletsprojects.com)
- **React Native Documentation**: [reactnative.dev](https://reactnative.dev)

## Example Railway Configuration

Your `railway.json` file should look like this:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "gunicorn app:app --bind 0.0.0.0:$PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

This configuration ensures:
- Proper Python environment setup
- Gunicorn for production serving
- Health checks for monitoring
- Automatic restarts on failure 