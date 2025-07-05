import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

class TensorFlowService {
  constructor() {
    this.model = null;
    this.labels = [];
    this.isInitialized = false;
  }

  // Initialize TensorFlow.js
  async initialize() {
    try {
      console.log('Initializing TensorFlow.js...');
      
      // Wait for TensorFlow.js to be ready
      await tf.ready();
      console.log('TensorFlow.js is ready');

      // Set backend (CPU for React Native)
      await tf.setBackend('cpu');
      console.log('Backend set to CPU');

      // Load labels
      await this.loadLabels();
      
      // Load model (we'll implement this next)
      await this.loadModel();
      
      this.isInitialized = true;
      console.log('TensorFlow service initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Error initializing TensorFlow service:', error);
      throw error;
    }
  }

  // Load food labels
  async loadLabels() {
    try {
      // For now, we'll use a simplified version of your 302 labels
      // In production, you'd load this from a bundled file
      this.labels = [
        // Food-101 labels (first 101)
        'apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare',
        'beet_salad', 'beignets', 'bibimbap', 'bread_pudding', 'breakfast_burrito',
        'bruschetta', 'caesar_salad', 'cannoli', 'caprese_salad', 'carrot_cake',
        'ceviche', 'cheesecake', 'cheese_plate', 'chicken_curry', 'chicken_quesadilla',
        'chicken_wings', 'chocolate_cake', 'chocolate_mousse', 'churros', 'clam_chowder',
        'club_sandwich', 'crab_cakes', 'creme_brulee', 'croque_madame', 'cup_cakes',
        'deviled_eggs', 'donuts', 'dumplings', 'edamame', 'eggs_benedict', 'escargots',
        'falafel', 'filet_mignon', 'fish_and_chips', 'foie_gras', 'french_fries',
        'french_onion_soup', 'french_toast', 'fried_calamari', 'fried_rice', 'frozen_yogurt',
        'garlic_bread', 'gnocchi', 'greek_salad', 'grilled_cheese_sandwich', 'grilled_salmon',
        'guacamole', 'gyoza', 'hamburger', 'hot_and_sour_soup', 'hot_dog', 'huevos_rancheros',
        'hummus', 'ice_cream', 'lasagna', 'lobster_bisque', 'lobster_roll_sandwich',
        'macaroni_and_cheese', 'macarons', 'miso_soup', 'mussels', 'nachos', 'omelette',
        'onion_rings', 'oysters', 'pad_thai', 'paella', 'pancakes', 'panna_cotta',
        'peking_duck', 'pho', 'pizza', 'pork_chop', 'poutine', 'prime_rib', 'pulled_pork_sandwich',
        'ramen', 'ravioli', 'red_velvet_cake', 'risotto', 'samosa', 'sashimi', 'scallops',
        'seaweed_salad', 'shrimp_and_grits', 'spaghetti_bolognese', 'spaghetti_carbonara',
        'spring_rolls', 'steak', 'strawberry_shortcake', 'sushi', 'tacos', 'takoyaki',
        'tiramisu', 'tuna_tartare', 'waffles',
        
        // Fruits360 labels (next 131)
        'Apple Braeburn', 'Apple Crimson Snow', 'Apple Golden 1', 'Apple Golden 2', 'Apple Golden 3',
        'Apple Granny Smith', 'Apple Pink Lady', 'Apple Red 1', 'Apple Red 2', 'Apple Red 3',
        'Apple Red Delicious', 'Apple Red Yellow 1', 'Apple Red Yellow 2', 'Apricot', 'Avocado',
        'Avocado ripe', 'Banana', 'Banana Lady Finger', 'Banana Red', 'Beetroot',
        'Blueberry', 'Cactus fruit', 'Cantaloupe 1', 'Cantaloupe 2', 'Carambula',
        'Cauliflower', 'Cherry 1', 'Cherry 2', 'Cherry Rainier', 'Cherry Wax Black',
        'Cherry Wax Red', 'Cherry Wax Yellow', 'Chestnut', 'Clementine', 'Cocos',
        'Corn', 'Corn Husk', 'Cucumber Ripe', 'Cucumber Ripe 2', 'Dates',
        'Eggplant', 'Fig', 'Ginger Root', 'Granadilla', 'Grape Blue',
        'Grape Pink', 'Grape White', 'Grape White 2', 'Grape White 3', 'Grape White 4',
        'Grapefruit Pink', 'Grapefruit White', 'Guava', 'Hazelnut', 'Huckleberry',
        'Kaki', 'Kiwi', 'Kohlrabi', 'Kumquats', 'Lemon',
        'Lemon Meyer', 'Limes', 'Lychee', 'Mandarine', 'Mango',
        'Mango Red', 'Mangostan', 'Maracuja', 'Melon Piel de Sapo', 'Mulberry',
        'Nectarine', 'Nectarine Flat', 'Nut Forest', 'Nut Pecan', 'Onion Red',
        'Onion Red Peeled', 'Onion White', 'Orange', 'Papaya', 'Passion Fruit',
        'Peach', 'Peach 2', 'Peach Flat', 'Pear', 'Pear 2',
        'Pear Abate', 'Pear Forelle', 'Pear Kaiser', 'Pear Monster', 'Pear Red',
        'Pear Stone', 'Pear Williams', 'Pepino', 'Pepper Green', 'Pepper Orange',
        'Pepper Red', 'Pepper Yellow', 'Physalis', 'Physalis with Husk', 'Pineapple',
        'Pineapple Mini', 'Pitahaya Red', 'Plum', 'Plum 2', 'Plum 3',
        'Pomegranate', 'Pomelo Sweetie', 'Potato Red', 'Potato Red Washed', 'Potato Sweet',
        'Potato White', 'Quince', 'Rambutan', 'Raspberry', 'Redcurrant',
        'Salak', 'Strawberry', 'Strawberry Wedge', 'Tamarillo', 'Tangelo',
        'Tomato 1', 'Tomato 2', 'Tomato 3', 'Tomato 4', 'Tomato Cherry Red',
        'Tomato Heart', 'Tomato Maroon', 'Tomato Yellow', 'Tomato not Ripened', 'Walnut',
        'Watermelon'
      ];
      
      console.log(`Loaded ${this.labels.length} food labels`);
    } catch (error) {
      console.error('Error loading labels:', error);
      throw error;
    }
  }

  // Load the trained model
  async loadModel() {
    try {
      console.log('Loading food classification model...');
      
      // Load your actual trained model
      this.model = await tf.loadLayersModel('path/to/your/model.json');
      
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  // Preprocess image for model input
  preprocessImage(imageUri) {
    return new Promise(async (resolve, reject) => {
      try {
        // Create an image element
        const img = new Image();
        img.onload = async () => {
          try {
            // Convert image to tensor
            const tensor = tf.browser.fromPixels(img);
            
            // Resize to 224x224 (model input size)
            const resized = tf.image.resizeBilinear(tensor, [224, 224]);
            
            // Normalize pixel values to [0, 1]
            const normalized = resized.div(255.0);
            
            // Add batch dimension
            const batched = normalized.expandDims(0);
            
            // Clean up tensors
            tensor.dispose();
            resized.dispose();
            normalized.dispose();
            
            resolve(batched);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = imageUri;
      } catch (error) {
        reject(error);
      }
    });
  }

  // Classify food image
  async classifyFood(imageUri) {
    try {
      if (!this.isInitialized) {
        throw new Error('TensorFlow service not initialized');
      }

      console.log('Classifying food image...');
      
      // Preprocess image
      const inputTensor = await this.preprocessImage(imageUri);
      
      // Run prediction
      const predictions = await this.model.predict(inputTensor);
      
      // Get top 5 predictions
      const topK = await tf.topk(predictions, 5);
      
      // Convert to regular arrays
      const values = await topK.values.array();
      const indices = await topK.indices.array();
      
      // Clean up tensors
      inputTensor.dispose();
      predictions.dispose();
      topK.values.dispose();
      topK.indices.dispose();
      
      // Format results
      const results = indices[0].map((index, i) => ({
        label: this.labels[index],
        confidence: values[0][i],
        index: index
      }));
      
      console.log('Classification results:', results);
      
      return results;
    } catch (error) {
      console.error('Error classifying food:', error);
      throw error;
    }
  }

  // Get microplastics estimate based on food type
  getMicroplasticsEstimate(foodLabel, confidence) {
    // This is a simplified estimation system
    // In a real app, you'd have a database of microplastics content per food type
    
    const microplasticsData = {
      // High microplastics foods
      'seafood': { min: 8, max: 15 },
      'salt': { min: 5, max: 12 },
      'beer': { min: 4, max: 10 },
      'honey': { min: 3, max: 8 },
      
      // Medium microplastics foods
      'chicken': { min: 2, max: 6 },
      'beef': { min: 2, max: 5 },
      'pork': { min: 2, max: 5 },
      
      // Low microplastics foods
      'fruits': { min: 0, max: 2 },
      'vegetables': { min: 0, max: 2 },
      'grains': { min: 0, max: 3 }
    };
    
    // Determine food category
    let category = 'low';
    if (foodLabel.toLowerCase().includes('fish') || 
        foodLabel.toLowerCase().includes('seafood') ||
        foodLabel.toLowerCase().includes('clam') ||
        foodLabel.toLowerCase().includes('crab') ||
        foodLabel.toLowerCase().includes('lobster') ||
        foodLabel.toLowerCase().includes('oyster') ||
        foodLabel.toLowerCase().includes('scallop') ||
        foodLabel.toLowerCase().includes('shrimp') ||
        foodLabel.toLowerCase().includes('tuna') ||
        foodLabel.toLowerCase().includes('salmon')) {
      category = 'seafood';
    } else if (foodLabel.toLowerCase().includes('apple') ||
               foodLabel.toLowerCase().includes('banana') ||
               foodLabel.toLowerCase().includes('orange') ||
               foodLabel.toLowerCase().includes('grape') ||
               foodLabel.toLowerCase().includes('strawberry') ||
               foodLabel.toLowerCase().includes('blueberry') ||
               foodLabel.toLowerCase().includes('peach') ||
               foodLabel.toLowerCase().includes('pear') ||
               foodLabel.toLowerCase().includes('mango') ||
               foodLabel.toLowerCase().includes('kiwi')) {
      category = 'fruits';
    } else if (foodLabel.toLowerCase().includes('carrot') ||
               foodLabel.toLowerCase().includes('tomato') ||
               foodLabel.toLowerCase().includes('cucumber') ||
               foodLabel.toLowerCase().includes('lettuce') ||
               foodLabel.toLowerCase().includes('spinach') ||
               foodLabel.toLowerCase().includes('broccoli') ||
               foodLabel.toLowerCase().includes('cauliflower') ||
               foodLabel.toLowerCase().includes('onion') ||
               foodLabel.toLowerCase().includes('potato') ||
               foodLabel.toLowerCase().includes('corn')) {
      category = 'vegetables';
    } else if (foodLabel.toLowerCase().includes('bread') ||
               foodLabel.toLowerCase().includes('rice') ||
               foodLabel.toLowerCase().includes('pasta') ||
               foodLabel.toLowerCase().includes('noodle')) {
      category = 'grains';
    } else if (foodLabel.toLowerCase().includes('chicken')) {
      category = 'chicken';
    } else if (foodLabel.toLowerCase().includes('beef') ||
               foodLabel.toLowerCase().includes('steak') ||
               foodLabel.toLowerCase().includes('burger')) {
      category = 'beef';
    } else if (foodLabel.toLowerCase().includes('pork')) {
      category = 'pork';
    }
    
    // Get microplastics range
    const range = microplasticsData[category] || { min: 1, max: 4 };
    
    // Calculate estimate based on confidence
    const baseEstimate = Math.random() * (range.max - range.min) + range.min;
    const confidenceMultiplier = 0.5 + (confidence * 0.5); // 0.5 to 1.0
    
    return Math.round(baseEstimate * confidenceMultiplier);
  }

  // Clean up resources
  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }
}

// Export singleton instance
export default new TensorFlowService(); 