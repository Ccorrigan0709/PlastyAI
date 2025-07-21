import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image, ScrollView } from 'react-native';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import ApiService from '../services/api';
import { StorageService } from '../services/storage';

const CameraScreen = ({ navigation }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleOpenCamera = () => {
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
    setAnalysisResult(null);
    
    try {
      // Convert image to base64
      const imageBase64 = await ApiService.imageToBase64(imageUri);
      
      // Send to Flask API for analysis
      const result = await ApiService.predictFood(imageBase64);
      
      setAnalysisResult(result);
      
      // Save the scan result to storage
      const now = new Date();
      console.log('CameraScreen: Current time when saving:', now.toISOString());
      
      const foodScanData = {
        foodItem: result.top_prediction.label,
        microplasticsCount: result.plasticizer_count || 0,
        plasticizerCount: result.plasticizer_count || 0,
        confidence: result.top_prediction.confidence,
        microplasticsDetected: result.microplastics_detected.detected,
        rawResult: result
      };
      
      await StorageService.saveFoodScan(foodScanData);
      console.log('CameraScreen: Saved scan data:', foodScanData);
      
      // Show results
      const foodName = result.top_prediction.label;
      const confidence = (result.top_prediction.confidence * 100).toFixed(1);
      const microplasticsDetected = result.microplastics_detected.detected;
      
      let message = `Food detected: ${foodName}\nConfidence: ${confidence}%`;
      
      if (microplasticsDetected) {
        const microConfidence = (result.microplastics_detected.confidence * 100).toFixed(1);
        message += `\n\n⚠️ Microplastics detected!\nConfidence: ${microConfidence}%\nReason: ${result.microplastics_detected.reason}`;
      } else {
        message += '\n\n✅ No microplastics detected';
      }
      
      Alert.alert(
        'Analysis Complete',
        message,
        [
          {
            text: 'View Details',
            onPress: () => {
              // Format the data for FoodDetail screen
              const foodItem = {
                foodItem: result.top_prediction.label,
                microplasticsCount: result.plasticizer_count || 0, // Use new plasticizer_count field
                date: new Date().toLocaleDateString(),
                confidence: result.top_prediction.confidence,
                microplasticsDetected: result.microplastics_detected.detected,
                plasticizerCount: result.plasticizer_count || 0, // Add the new field
                rawResult: result // Keep the full result for debugging
              };
              navigation.navigate('FoodDetail', { foodItem });
            },
          },
          {
            text: 'Take Another Photo',
            onPress: () => {
              setCapturedImage(null);
              setAnalysisResult(null);
            },
          },
          {
            text: 'OK',
            style: 'default',
          }
        ]
      );
      
    } catch (error) {
      console.error('Analysis failed:', error);
      Alert.alert(
        'Analysis Failed',
        'Unable to analyze the image. Please check your internet connection and try again.',
        [
          {
            text: 'Try Again',
            onPress: () => analyzeImage(imageUri),
          },
          {
            text: 'Cancel',
            style: 'cancel',
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
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {capturedImage ? (
          <View style={styles.imageContainer}>
            <Text style={styles.imageTitle}>Captured Image:</Text>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            {isAnalyzing && (
              <View style={styles.analyzingContainer}>
                <Text style={styles.analyzingText}>🔍 Analyzing for microplastics...</Text>
              </View>
            )}
            {analysisResult && !isAnalyzing && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Analysis Results:</Text>
                <Text style={styles.foodName}>
                  {analysisResult.top_prediction.label}
                </Text>
                <Text style={styles.confidence}>
                  Confidence: {(analysisResult.top_prediction.confidence * 100).toFixed(1)}%
                </Text>
                {analysisResult.microplastics_detected.detected ? (
                  <View style={styles.microplasticsDetected}>
                    <Text style={styles.microplasticsText}>
                      ⚠️ Microplastics Detected
                    </Text>
                    <Text style={styles.microplasticsReason}>
                      {analysisResult.microplastics_detected.reason}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.noMicroplastics}>
                    <Text style={styles.noMicroplasticsText}>
                      ✅ No Microplastics Detected
                    </Text>
                  </View>
                )}
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.cameraButton, isAnalyzing && styles.disabledButton]} 
            onPress={handleOpenCamera}
            disabled={isAnalyzing}
          >
            <Text style={styles.cameraButtonIcon}>📸</Text>
            <Text style={styles.cameraButtonText}>
              {capturedImage ? 'Take Another Photo' : 'Open Camera'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.noteText}>
            This will use your device's camera to capture and analyze food images
          </Text>
        </View>
      </ScrollView>
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
    flexGrow: 1, // Allow ScrollView to grow and take available space
    padding: 20,
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  capturedImage: {
    width: 280,
    height: 280,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 20,
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
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  confidence: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  microplasticsDetected: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    alignItems: 'center',
  },
  microplasticsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 5,
  },
  microplasticsReason: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
  noMicroplastics: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3e6cb',
    alignItems: 'center',
  },
  noMicroplasticsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#155724',
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
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
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
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
});

export default CameraScreen; 