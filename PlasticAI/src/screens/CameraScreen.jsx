import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image } from 'react-native';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';

const CameraScreen = ({ navigation }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const analyzeImage = (imageUri) => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Generate random microplastics count for demo
      const microplasticsCount = Math.floor(Math.random() * 15);
      
      Alert.alert(
        'Analysis Complete',
        `Found ${microplasticsCount} microplastic particle${microplasticsCount !== 1 ? 's' : ''} in your food sample.`,
        [
          {
            text: 'Take Another Photo',
            onPress: () => setCapturedImage(null),
          },
          {
            text: 'OK',
            style: 'default',
          }
        ]
      );
    }, 3000);
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
      <View style={styles.content}>
        {capturedImage ? (
          <View style={styles.imageContainer}>
            <Text style={styles.imageTitle}>Captured Image:</Text>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            {isAnalyzing && (
              <View style={styles.analyzingContainer}>
                <Text style={styles.analyzingText}>🔍 Analyzing for microplastics...</Text>
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
});

export default CameraScreen; 