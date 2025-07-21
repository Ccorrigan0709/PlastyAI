import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const HealthTipsScreen = ({ navigation }) => {
  const [showHealthTips, setShowHealthTips] = useState(true);
  const [showContaminationSources, setShowContaminationSources] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health & Education</Text>
        <Text style={styles.subtitle}>Learn about microplastics and how to reduce exposure</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, showHealthTips && styles.activeTab]}
            onPress={() => {
              setShowHealthTips(true);
              setShowContaminationSources(false);
            }}
          >
            <Text style={[styles.tabText, showHealthTips && styles.activeTabText]}>
              💡 Health Tips
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, showContaminationSources && styles.activeTab]}
            onPress={() => {
              setShowHealthTips(false);
              setShowContaminationSources(true);
            }}
          >
            <Text style={[styles.tabText, showContaminationSources && styles.activeTabText]}>
              🌱 Contamination Sources
            </Text>
          </TouchableOpacity>
        </View>

        {/* Health Tips Section */}
        {showHealthTips && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reduce Your Microplastics Exposure</Text>
            <Text style={styles.sectionSubtitle}>
              Practical tips to minimize your daily exposure to plasticizers and microplastics
            </Text>
            
            <View style={styles.tipCategory}>
              <Text style={styles.categoryTitle}>🥗 Food Choices</Text>
              <Text style={styles.tipText}>• Choose fresh, unpackaged foods when possible</Text>
              <Text style={styles.tipText}>• Select organic produce (often less processed)</Text>
              <Text style={styles.tipText}>• Avoid canned foods with plastic linings</Text>
              <Text style={styles.tipText}>• Choose bulk foods with minimal packaging</Text>
              <Text style={styles.tipText}>• Avoid processed meats and high-fat dairy products</Text>
              <Text style={styles.tipText}>• Choose fresh fruits over processed snacks</Text>
              <Text style={styles.tipText}>• Avoid fast food and heavily processed meals</Text>
              <Text style={styles.tipText}>• Choose fresh herbs over dried in plastic containers</Text>
              <Text style={styles.tipText}>• Choose loose tea over tea bags with plastic</Text>
            </View>
            
            <View style={styles.tipCategory}>
              <Text style={styles.categoryTitle}>🏠 Storage & Cooking</Text>
              <Text style={styles.tipText}>• Use glass or ceramic containers for storage</Text>
              <Text style={styles.tipText}>• Store leftovers in glass containers, not plastic wrap</Text>
              <Text style={styles.tipText}>• Use beeswax wraps instead of plastic wrap</Text>
              <Text style={styles.tipText}>• Avoid heating food in plastic containers</Text>
              <Text style={styles.tipText}>• Avoid microwaving food in plastic containers</Text>
              <Text style={styles.tipText}>• Use silicone baking mats instead of parchment paper</Text>
              <Text style={styles.tipText}>• Use stainless steel or bamboo utensils instead of plastic</Text>
              <Text style={styles.tipText}>• Use cast iron or ceramic cookware</Text>
              <Text style={styles.tipText}>• Avoid non-stick pans with plastic coatings</Text>
            </View>
            
            <View style={styles.tipCategory}>
              <Text style={styles.categoryTitle}>🛒 Shopping & Lifestyle</Text>
              <Text style={styles.tipText}>• Use cloth shopping bags instead of plastic bags</Text>
              <Text style={styles.tipText}>• Choose tap water over bottled water when safe</Text>
              <Text style={styles.tipText}>• Filter your drinking water with activated carbon filters</Text>
              <Text style={styles.tipText}>• Avoid single-use plastic straws and cutlery</Text>
              <Text style={styles.tipText}>• Use natural cleaning products in glass bottles</Text>
              <Text style={styles.tipText}>• Choose products with minimal packaging</Text>
              <Text style={styles.tipText}>• Support local farmers markets</Text>
              <Text style={styles.tipText}>• Bring your own containers for takeout</Text>
              <Text style={styles.tipText}>• Choose bar soap over liquid soap in plastic bottles</Text>
            </View>

            <View style={styles.tipCategory}>
              <Text style={styles.categoryTitle}>🧴 Personal Care</Text>
              <Text style={styles.tipText}>• Choose natural cosmetics without microbeads</Text>
              <Text style={styles.tipText}>• Use bamboo toothbrushes instead of plastic</Text>
              <Text style={styles.tipText}>• Choose shampoo bars over liquid shampoo</Text>
              <Text style={styles.tipText}>• Use natural deodorant in cardboard packaging</Text>
              <Text style={styles.tipText}>• Choose menstrual cups over disposable products</Text>
              <Text style={styles.tipText}>• Use cloth diapers when possible</Text>
            </View>

            <View style={styles.tipCategory}>
              <Text style={styles.categoryTitle}>🏠 Home & Environment</Text>
              <Text style={styles.tipText}>• Use natural fiber clothing (cotton, wool, hemp)</Text>
              <Text style={styles.tipText}>• Choose furniture made from natural materials</Text>
              <Text style={styles.tipText}>• Use natural fiber carpets and rugs</Text>
              <Text style={styles.tipText}>• Avoid synthetic air fresheners</Text>
              <Text style={styles.tipText}>• Use natural pest control methods</Text>
              <Text style={styles.tipText}>• Compost food waste instead of using plastic bags</Text>
            </View>
          </View>
        )}

        {/* Contamination Sources Section */}
        {showContaminationSources && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Where Plasticizers Come From</Text>
            <Text style={styles.sectionSubtitle}>
              Understanding the sources of microplastics and plasticizers in our food supply
            </Text>
            
            <View style={styles.sourceCategory}>
              <Text style={styles.categoryTitle}>🌾 Agricultural Sources</Text>
              <Text style={styles.sourceText}>• Plastic mulch films used in farming</Text>
              <Text style={styles.sourceText}>• Irrigation systems with plastic pipes</Text>
              <Text style={styles.sourceText}>• Plastic containers for pesticides/fertilizers</Text>
              <Text style={styles.sourceText}>• Plastic greenhouse coverings</Text>
              <Text style={styles.sourceText}>• Plastic twine and plant supports</Text>
              <Text style={styles.sourceText}>• Plastic seedling trays and pots</Text>
              <Text style={styles.sourceText}>• Plastic silage wrap for animal feed</Text>
              <Text style={styles.sourceText}>• Plastic water tanks and storage</Text>
            </View>
            
            <View style={styles.sourceCategory}>
              <Text style={styles.categoryTitle}>🚛 Processing & Transport</Text>
              <Text style={styles.sourceText}>• Plastic crates and containers</Text>
              <Text style={styles.sourceText}>• Plastic packaging materials</Text>
              <Text style={styles.sourceText}>• Plastic conveyor belts</Text>
              <Text style={styles.sourceText}>• Plastic sorting and washing equipment</Text>
              <Text style={styles.sourceText}>• Plastic pallets and storage bins</Text>
              <Text style={styles.sourceText}>• Plastic food processing machinery</Text>
              <Text style={styles.sourceText}>• Plastic transport containers</Text>
              <Text style={styles.sourceText}>• Plastic refrigeration units</Text>
            </View>
            
            <View style={styles.sourceCategory}>
              <Text style={styles.categoryTitle}>🏪 Retail & Storage</Text>
              <Text style={styles.sourceText}>• Plastic produce bags</Text>
              <Text style={styles.sourceText}>• Plastic clamshell containers</Text>
              <Text style={styles.sourceText}>• Plastic wrap and film</Text>
              <Text style={styles.sourceText}>• Plastic storage bins and displays</Text>
              <Text style={styles.sourceText}>• Plastic refrigeration units</Text>
              <Text style={styles.sourceText}>• Plastic shopping bags</Text>
              <Text style={styles.sourceText}>• Plastic price tags and labels</Text>
              <Text style={styles.sourceText}>• Plastic display cases and shelving</Text>
            </View>
            
            <View style={styles.sourceCategory}>
              <Text style={styles.categoryTitle}>🏠 Home Storage</Text>
              <Text style={styles.sourceText}>• Plastic food storage containers</Text>
              <Text style={styles.sourceText}>• Plastic wrap and bags</Text>
              <Text style={styles.sourceText}>• Plastic cutting boards</Text>
              <Text style={styles.sourceText}>• Plastic utensils and tools</Text>
              <Text style={styles.sourceText}>• Plastic refrigerator shelves</Text>
              <Text style={styles.sourceText}>• Plastic water bottles and cups</Text>
              <Text style={styles.sourceText}>• Plastic food processors and blenders</Text>
              <Text style={styles.sourceText}>• Plastic microwave-safe containers</Text>
            </View>
            
            <View style={styles.sourceCategory}>
              <Text style={styles.categoryTitle}>💧 Environmental Sources</Text>
              <Text style={styles.sourceText}>• Microplastics in soil and water</Text>
              <Text style={styles.sourceText}>• Airborne plastic particles</Text>
              <Text style={styles.sourceText}>• Plastic pollution in irrigation water</Text>
              <Text style={styles.sourceText}>• Plastic waste in agricultural areas</Text>
              <Text style={styles.sourceText}>• Microplastics in rainwater</Text>
              <Text style={styles.sourceText}>• Plastic particles in dust</Text>
              <Text style={styles.sourceText}>• Plastic pollution in oceans and rivers</Text>
              <Text style={styles.sourceText}>• Plastic waste in landfills leaching into soil</Text>
            </View>

            <View style={styles.sourceCategory}>
              <Text style={styles.categoryTitle}>🏭 Industrial Sources</Text>
              <Text style={styles.sourceText}>• Plastic manufacturing facilities</Text>
              <Text style={styles.sourceText}>• Plastic recycling plants</Text>
              <Text style={styles.sourceText}>• Plastic waste incineration</Text>
              <Text style={styles.sourceText}>• Plastic in wastewater treatment</Text>
              <Text style={styles.sourceText}>• Plastic in sewage sludge used as fertilizer</Text>
              <Text style={styles.sourceText}>• Plastic in industrial runoff</Text>
            </View>
          </View>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  section: {
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  tipCategory: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  sourceCategory: {
    marginBottom: 25,
  },
  sourceText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default HealthTipsScreen; 