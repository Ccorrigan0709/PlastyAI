// Test script for TensorFlow.js integration
// Run with: node test_tensorflow.js

const tf = require('@tensorflow/tfjs-node');

async function testTensorFlow() {
  console.log('🧪 Testing TensorFlow.js Integration...\n');
  
  try {
    // Test 1: TensorFlow.js initialization
    console.log('1. Testing TensorFlow.js initialization...');
    await tf.ready();
    console.log('✅ TensorFlow.js is ready');
    console.log(`   Backend: ${tf.getBackend()}`);
    console.log(`   Version: ${tf.version.tfjs}\n`);
    
    // Test 2: Create a simple model
    console.log('2. Testing model creation...');
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [224 * 224 * 3], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 302, activation: 'softmax' })
      ]
    });
    
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    
    console.log('✅ Model created successfully');
    console.log(`   Input shape: ${model.inputShape}`);
    console.log(`   Output shape: ${model.outputShape}\n`);
    
    // Test 3: Create dummy input data
    console.log('3. Testing tensor operations...');
    const dummyInput = tf.randomNormal([1, 224 * 224 * 3]);
    console.log('✅ Dummy input tensor created');
    console.log(`   Shape: ${dummyInput.shape}`);
    console.log(`   Data type: ${dummyInput.dtype}\n`);
    
    // Test 4: Run prediction
    console.log('4. Testing model prediction...');
    const prediction = model.predict(dummyInput);
    console.log('✅ Prediction completed');
    console.log(`   Output shape: ${prediction.shape}`);
    
    // Test 5: Get top predictions
    console.log('5. Testing top-k predictions...');
    const topK = await tf.topk(prediction, 5);
    const values = await topK.values.array();
    const indices = await topK.indices.array();
    
    console.log('✅ Top-5 predictions extracted');
    console.log('   Top predictions:');
    indices[0].forEach((index, i) => {
      console.log(`   ${i + 1}. Class ${index}: ${(values[0][i] * 100).toFixed(2)}%`);
    });
    
    // Test 6: Memory cleanup
    console.log('\n6. Testing memory cleanup...');
    dummyInput.dispose();
    prediction.dispose();
    topK.values.dispose();
    topK.indices.dispose();
    model.dispose();
    console.log('✅ Memory cleaned up successfully');
    
    // Test 7: Labels array
    console.log('\n7. Testing labels array...');
    const labels = [
      // Food-101 labels (first 101)
      'apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare',
      // ... (simplified for test)
      
      // Fruits360 labels (next 131)
      'Apple Braeburn', 'Apple Crimson Snow', 'Apple Golden 1', 'Apple Golden 2', 'Apple Golden 3',
      // ... (simplified for test)
    ];
    
    console.log(`✅ Labels array created with ${labels.length} classes`);
    console.log(`   First 5 labels: ${labels.slice(0, 5).join(', ')}`);
    console.log(`   Last 5 labels: ${labels.slice(-5).join(', ')}\n`);
    
    console.log('🎉 All TensorFlow.js tests passed successfully!');
    console.log('\n📱 Ready for React Native integration!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testTensorFlow(); 