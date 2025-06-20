import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const FoodDetailScreen = ({ route, navigation }) => {
  const { foodItem } = route.params;

  // Generate realistic daily breakdown based on the selected food item
  const generateDayBreakdown = (selectedFood) => {
    const breakdownOptions = {
      'Salmon Fillet': [
        { food: 'Salmon Fillet', count: selectedFood.microplasticsCount, isSelected: true },
        { food: 'Rice Side', count: 1, isSelected: false },
        { food: 'Steamed Vegetables', count: 0, isSelected: false },
      ],
      'Tuna Sashimi': [
        { food: 'Tuna Sashimi', count: selectedFood.microplasticsCount, isSelected: true },
        { food: 'Soy Sauce', count: 1, isSelected: false },
        { food: 'Wasabi', count: 0, isSelected: false },
        { food: 'Pickled Ginger', count: 1, isSelected: false },
      ],
      'Grilled Chicken': [
        { food: 'Grilled Chicken', count: selectedFood.microplasticsCount, isSelected: true },
        { food: 'Garden Salad', count: 1, isSelected: false },
        { food: 'Bread Roll', count: 2, isSelected: false },
      ],
      'Sea Bass': [
        { food: 'Sea Bass', count: selectedFood.microplasticsCount, isSelected: true },
        { food: 'Lemon Butter Sauce', count: 1, isSelected: false },
        { food: 'Roasted Potatoes', count: 1, isSelected: false },
        { food: 'Asparagus', count: 0, isSelected: false },
      ],
      'Shrimp Salad': [
        { food: 'Shrimp Salad', count: selectedFood.microplasticsCount, isSelected: true },
        { food: 'Mixed Greens', count: 2, isSelected: false },
        { food: 'Dressing', count: 1, isSelected: false },
        { food: 'Croutons', count: 1, isSelected: false },
      ],
    };

    return breakdownOptions[selectedFood.foodItem] || [
      { food: selectedFood.foodItem, count: selectedFood.microplasticsCount, isSelected: true },
      { food: 'Side Dish', count: 1, isSelected: false },
      { food: 'Beverage', count: 0, isSelected: false },
    ];
  };

  const dayBreakdown = generateDayBreakdown(foodItem);

  // Food-specific information database
  const foodDatabase = {
    'Salmon Fillet': {
      saferAlternatives: [
        'Wild-caught salmon from Alaska',
        'Organic farm-raised salmon',
        'Fresh local fish from trusted sources',
        'Plant-based salmon alternatives'
      ],
      contaminationSources: [
        'Ocean plastic pollution absorbed through gills',
        'Microplastics in fish feed',
        'Plastic packaging during transport',
        'Processing facility contamination'
      ],
      tips: [
        'Choose wild-caught over farm-raised when possible',
        'Remove skin before cooking to reduce contamination',
        'Buy from suppliers with plastic-free packaging',
        'Consider smaller fish species with lower contamination'
      ],
      riskLevel: 'Medium',
      color: '#FF6B35'
    },
    'Tuna Sashimi': {
      saferAlternatives: [
        'Smaller fish species (sardines, anchovies)',
        'Locally caught fresh fish',
        'Plant-based sashimi alternatives',
        'Organic farmed fish'
      ],
      contaminationSources: [
        'Large fish accumulate more microplastics',
        'Ocean pollution in fishing areas',
        'Plastic wrap and packaging',
        'Processing equipment contamination'
      ],
      tips: [
        'Limit consumption of large predatory fish',
        'Choose sashimi-grade fish from reputable sources',
        'Ask about sourcing and handling practices',
        'Consider rotating with smaller fish species'
      ],
      riskLevel: 'High',
      color: '#FF3B30'
    },
    'Grilled Chicken': {
      saferAlternatives: [
        'Organic free-range chicken',
        'Local farm-raised poultry',
        'Plant-based chicken alternatives',
        'Wild game birds'
      ],
      contaminationSources: [
        'Plastic feed containers',
        'Packaging materials',
        'Processing facility equipment',
        'Water source contamination'
      ],
      tips: [
        'Choose organic and free-range options',
        'Buy from local farms with known practices',
        'Avoid pre-packaged processed chicken',
        'Remove skin which may contain more contaminants'
      ],
      riskLevel: 'Clean',
      color: '#34C759'
    },
    'Sea Bass': {
      saferAlternatives: [
        'Smaller coastal fish',
        'Freshwater fish from clean sources',
        'Sustainably farmed bass',
        'Plant-based fish alternatives'
      ],
      contaminationSources: [
        'Coastal water pollution',
        'Microplastic ingestion from prey',
        'Plastic fishing gear fragments',
        'Industrial runoff in fishing areas'
      ],
      tips: [
        'Check the source of the fishing area',
        'Choose line-caught over net-caught fish',
        'Avoid fish from heavily polluted waters',
        'Consider fish from cleaner, remote areas'
      ],
      riskLevel: 'Medium',
      color: '#FF6B35'
    },
    'Shrimp Salad': {
      saferAlternatives: [
        'Wild-caught shrimp from clean waters',
        'Organic farmed shrimp',
        'Plant-based shrimp alternatives',
        'Local freshwater prawns'
      ],
      contaminationSources: [
        'Filter-feeding nature concentrates microplastics',
        'Coastal pollution in shrimp farms',
        'Plastic packaging and processing',
        'Contaminated feed in aquaculture'
      ],
      tips: [
        'Choose wild-caught over farmed when possible',
        'Look for plastic-free packaging',
        'Consider the source water quality',
        'Limit consumption of filter-feeding shellfish'
      ],
      riskLevel: 'Very High',
      color: '#8B0000'
    }
  };

  const foodInfo = foodDatabase[foodItem.foodItem] || {
    saferAlternatives: ['Choose organic options', 'Buy from trusted sources'],
    contaminationSources: ['Unknown contamination sources'],
    tips: ['Research the food source', 'Consider alternatives'],
    riskLevel: 'Unknown',
    color: '#666'
  };

  const totalDayCount = dayBreakdown.reduce((sum, item) => sum + item.count, 0);

  const renderDayBreakdown = () => {
    return (
      <View style={styles.dayBreakdownContainer}>
        <Text style={styles.dayBreakdownTitle}>
          {foodItem.date} Daily Breakdown ({totalDayCount} total particles)
        </Text>
        <View style={styles.horizontalChart}>
          {dayBreakdown.map((item, index) => {
            const percentage = totalDayCount > 0 ? (item.count / totalDayCount) * 100 : 0;
            const barWidth = (percentage / 100) * (width - 80);
            
            return (
              <View key={index} style={styles.horizontalBarWrapper}>
                <View style={styles.horizontalBarInfo}>
                  <Text style={[
                    styles.horizontalBarLabel,
                    item.isSelected && styles.selectedLabel
                  ]}>
                    {item.food}
                  </Text>
                  <Text style={styles.horizontalBarCount}>{item.count}</Text>
                </View>
                <View style={styles.horizontalBarContainer}>
                  <View
                    style={[
                      styles.horizontalBar,
                      {
                        width: barWidth,
                        backgroundColor: item.isSelected ? '#007AFF' : '#E0E0E0',
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.foodName}>{foodItem.foodItem}</Text>
            <Text style={styles.foodDate}>{foodItem.date} at {foodItem.time}</Text>
            <View style={styles.contaminationBadge}>
              <View style={[
                styles.contaminationDot,
                { backgroundColor: foodInfo.color }
              ]} />
              <Text style={styles.contaminationText}>
                {foodItem.microplasticsCount} particles - {foodInfo.riskLevel} Risk
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Breakdown Chart */}
        {renderDayBreakdown()}

        {/* Contamination Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔍 Possible Contamination Sources</Text>
          {foodInfo.contaminationSources.map((source, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{source}</Text>
            </View>
          ))}
        </View>

        {/* Safer Alternatives */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Safer Alternatives</Text>
          {foodInfo.saferAlternatives.map((alternative, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{alternative}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Reduction Tips</Text>
          {foodInfo.tips.map((tip, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Health Impact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚕️ Health Impact</Text>
          <View style={styles.healthCard}>
            <Text style={styles.healthTitle}>Microplastics Health Effects:</Text>
            <Text style={styles.healthText}>
              • May disrupt endocrine system{'\n'}
              • Potential inflammatory responses{'\n'}
              • Possible cellular damage{'\n'}
              • Long-term effects still being studied
            </Text>
            <Text style={styles.healthNote}>
              Note: Research on microplastics health effects is ongoing. 
              Consult healthcare providers for personalized advice.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerInfo: {
    alignItems: 'center',
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  foodDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  contaminationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  contaminationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  contaminationText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  dayBreakdownContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayBreakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  horizontalChart: {
    marginTop: 10,
  },
  horizontalBarWrapper: {
    marginBottom: 12,
  },
  horizontalBarInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  horizontalBarLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  horizontalBarCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  horizontalBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  horizontalBar: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 10,
  },
  bullet: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
    marginTop: 1,
  },
  listText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    flex: 1,
  },
  healthCard: {
    backgroundColor: '#f8f9ff',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  healthText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  healthNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

export default FoodDetailScreen; 