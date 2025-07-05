class APIService {
  constructor() {
    // Replace with your Heroku app URL when deployed
    this.baseURL = 'http://localhost:5000'; // Local development
    // this.baseURL = 'https://your-heroku-app.herokuapp.com'; // Production
  }

  // Convert image to base64
  async imageToBase64(imageUri) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', imageUri);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  // Check API health
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Classify food image
  async classifyFood(imageUri) {
    try {
      console.log('Converting image to base64...');
      const base64Image = await this.imageToBase64(imageUri);
      
      console.log('Sending image to API...');
      const response = await fetch(`${this.baseURL}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Classification failed');
      }

      console.log('Classification results:', data);
      return data.predictions;
      
    } catch (error) {
      console.error('Error classifying food:', error);
      throw error;
    }
  }

  // Get microplastics estimate (now handled by API)
  getMicroplasticsEstimate(foodLabel, confidence) {
    // This is now handled by the API, but keeping for compatibility
    console.warn('getMicroplasticsEstimate should be called from API results');
    return 0;
  }
}

// Export singleton instance
export default new APIService(); 