import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image } from 'react-native';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import APIService from '../services/APIService';

const CameraScreen = ({ navigation }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Check API connection on component mount
  useEffect(() => {
    checkAPIConnection();
  }, []);

  const checkAPIConnection = async () => {
    try {
      console.log('Checking API connection...');
      const health = await APIService.checkHealth();
      setIsConnected(health.model_loaded);
      console.log('API connection status:', health);
    } catch (error) {
      console.error('Failed to connect to API:', error);
      setIsConnected(false);
      Alert.alert(
        'Connection Error',
        'Failed to connect to the AI server. Please check your internet connection.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleOpenCamera = () => {
    if (!isConnected) {
      Alert.alert(
        'Server Not Available',
        'The AI server is not available. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Select Image Source',
      'Choose how you want to capture your food image:',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Photo Library',
          onPress: () => openImageLibrary(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        }
      ]
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setCapturedImage(imageUri);
        analyzeImage(imageUri);
      }
    });
  };

  const openImageLibrary = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image library');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setCapturedImage(imageUri);
        analyzeImage(imageUri);
      }
    });
  };

  const analyzeImage = async (imageUri) => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    try {
      console.log('Starting food classification via API...');
      
      // Classify the food using API
      const classificationResults = await APIService.classifyFood(imageUri);
      
      if (classificationResults && classificationResults.length > 0) {
        const topResult = classificationResults[0];
        
        const results = {
          foodType: topResult.label,
          confidence: topResult.confidence,
          microplasticsCount: topResult.microplastics_count,
          allPredictions: classificationResults.slice(0, 5)
        };
        
        setAnalysisResults(results);
        
        // Show results alert
        Alert.alert(
          'Analysis Complete',
          `Detected: ${topResult.label}\nConfidence: ${(topResult.confidence * 100).toFixed(1)}%\nMicroplastics: ${topResult.microplastics_count} particles`,
          [
            {
              text: 'View Details',
              onPress: () => navigation.navigate('FoodDetail', { results }),
            },
            {
              text: 'Take Another Photo',
              onPress: () => {
                setCapturedImage(null);
                setAnalysisResults(null);
              },
            },
            {
              text: 'OK',
              style: 'default',
            }
          ]
        );
      } else {
        throw new Error('No classification results');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert(
        'Analysis Error',
        'Failed to analyze the image. Please try again with a clearer photo.',
        [
          {
            text: 'Try Again',
            onPress: () => setCapturedImage(null),
          },
          {
            text: 'OK',
            style: 'default',
          }
        ]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Microplastics Tracker</Text>
        <View style={styles.welcomeContainer}>
          <Text style={styles.cameraLogo}>📷</Text>
          <Text style={styles.welcomeText}>Ready to scan your food?</Text>
          <Text style={styles.subText}>Take a photo to detect microplastics in your food</Text>
          {!isConnected && (
            <Text style={styles.connectionText}>🌐 Connecting to AI server...</Text>
          )}
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {capturedImage ? (
          <View style={styles.imageContainer}>
            <Text style={styles.imageTitle}>Captured Image:</Text>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            
            {isAnalyzing && (
              <View style={styles.analyzingContainer}>
                <Text style={styles.analyzingText}>🔍 Analyzing for microplastics...</Text>
                <Text style={styles.analyzingSubText}>AI is identifying your food</Text>
              </View>
            )}
            
            {analysisResults && !isAnalyzing && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Analysis Results:</Text>
                <Text style={styles.foodTypeText}>
                  🍽️ {analysisResults.foodType}
                </Text>
                <Text style={styles.confidenceText}>
                  Confidence: {(analysisResults.confidence * 100).toFixed(1)}%
                </Text>
                <Text style={styles.microplasticsText}>
                  🧬 {analysisResults.microplasticsCount} microplastic particles detected
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.instructionContainer}>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Place your food on a clean, well-lit surface</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Tap the camera button below</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Take a clear photo of your food</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>Get instant microplastics analysis</Text>
            </View>
          </View>
        )}

        {/* Camera Button */}
        <TouchableOpacity 
          style={[
            styles.cameraButton, 
            (isAnalyzing || !isConnected) && styles.disabledButton
          ]} 
          onPress={handleOpenCamera}
          disabled={isAnalyzing || !isConnected}
        >
          <Text style={styles.cameraButtonIcon}>📸</Text>
          <Text style={styles.cameraButtonText}>
            {!isConnected ? 'Connecting...' : 
             capturedImage ? 'Take Another Photo' : 'Open Camera'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.noteText}>
          This will use your device's camera to capture and analyze food images
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  cameraLogo: {
    fontSize: 50,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  capturedImage: {
    width: 250,
    height: 250,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  analyzingContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  analyzingText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  analyzingSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cameraButtonIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  foodTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  microplasticsText: {
    fontSize: 14,
    color: '#666',
  },
  connectionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default CameraScreen; 