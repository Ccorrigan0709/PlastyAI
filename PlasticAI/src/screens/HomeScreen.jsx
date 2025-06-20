import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');
const MAX_BAR_HEIGHT = 120;

const HomeScreen = ({ navigation }) => {
  // Mock data for weekly microplastics consumption
  const weeklyData = [
    { day: 'Mon', count: 12, date: '15' },
    { day: 'Tue', count: 3, date: '16' },
    { day: 'Wed', count: 8, date: '17' },
    { day: 'Thu', count: 0, date: '18' },
    { day: 'Fri', count: 15, date: '19' },
    { day: 'Sat', count: 5, date: '20' },
    { day: 'Sun', count: 2, date: '21' },
  ];

  const maxCount = Math.max(...weeklyData.map(item => item.count));

  const getContaminationColor = (count) => {
    if (count === 0) return '#34C759'; // Green - Clean
    if (count <= 3) return '#FF9500'; // Orange - Low
    if (count <= 7) return '#FF6B35'; // Red-orange - Medium
    if (count <= 10) return '#FF3B30'; // Red - High
    return '#8B0000'; // Dark red - Very high
  };

  const getContaminationLevel = (count) => {
    if (count === 0) return 'Clean';
    if (count <= 3) return 'Low';
    if (count <= 7) return 'Medium';
    if (count <= 10) return 'High';
    return 'Very High';
  };

  const totalWeekly = weeklyData.reduce((sum, day) => sum + day.count, 0);
  const averageDaily = (totalWeekly / 7).toFixed(1);

  const renderBarChart = () => {
    return (
      <TouchableOpacity 
        style={styles.chartContainer}
        onPress={() => navigation.navigate('Trends')}
        activeOpacity={0.8}
      >
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Weekly Microplastics</Text>
          <Text style={styles.chartHint}>Click to see trendline</Text>
        </View>
        
        {/* Y-axis labels */}
        <View style={styles.chartWrapper}>
          <View style={styles.yAxisContainer}>
            <Text style={styles.yAxisLabel}>{maxCount}</Text>
            <Text style={styles.yAxisLabel}>{Math.round(maxCount * 0.75)}</Text>
            <Text style={styles.yAxisLabel}>{Math.round(maxCount * 0.5)}</Text>
            <Text style={styles.yAxisLabel}>{Math.round(maxCount * 0.25)}</Text>
            <Text style={styles.yAxisLabel}>0</Text>
          </View>
          
          {/* Chart area */}
          <View style={styles.chartArea}>
            {/* Grid lines */}
            <View style={styles.gridLines}>
              {[0, 1, 2, 3, 4].map(index => (
                <View key={index} style={styles.gridLine} />
              ))}
            </View>
            
            {/* Bars */}
            <View style={styles.barsContainer}>
              {weeklyData.map((item, index) => {
                const barHeight = maxCount > 0 ? (item.count / maxCount) * MAX_BAR_HEIGHT : 0;
                return (
                  <View key={index} style={styles.barWrapper}>
                    <View style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: getContaminationColor(item.count),
                          },
                        ]}
                      />
                      {item.count > 0 && (
                        <Text style={styles.barValue}>{item.count}</Text>
                      )}
                    </View>
                    <Text style={styles.dayLabel}>{item.day}</Text>
                    <Text style={styles.dateLabel}>{item.date}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Contamination Levels:</Text>
          <View style={styles.legendItems}>
            {[
              { level: 'Clean', color: '#34C759', range: '0' },
              { level: 'Low', color: '#FF9500', range: '1-3' },
              { level: 'Medium', color: '#FF6B35', range: '4-7' },
              { level: 'High', color: '#FF3B30', range: '8-10' },
              { level: 'Very High', color: '#8B0000', range: '11+' },
            ].map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.level} ({item.range})</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to PlasticAI</Text>
          <Text style={styles.subtitle}>Track your microplastics exposure</Text>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🧬</Text>
          </View>
        </View>

        {/* Weekly Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>This Week's Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{totalWeekly}</Text>
              <Text style={styles.statLabel}>Total Particles</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{averageDaily}</Text>
              <Text style={styles.statLabel}>Daily Average</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[
                styles.statNumber,
                { color: getContaminationColor(Math.round(parseFloat(averageDaily))) }
              ]}>
                {getContaminationLevel(Math.round(parseFloat(averageDaily)))}
              </Text>
              <Text style={styles.statLabel}>Risk Level</Text>
            </View>
          </View>
        </View>

        {/* Bar Chart */}
        {renderBarChart()}

        {/* Health Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Health Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Choose fresh, unpackaged foods when possible</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Avoid heating food in plastic containers</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Use glass or ceramic containers for storage</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Filter your drinking water</Text>
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
    alignItems: 'center',
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
    marginBottom: 15,
  },
  logoContainer: {
    marginTop: 10,
  },
  logo: {
    fontSize: 40,
  },
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  chartContainer: {
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
    flexWrap: 'wrap',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    flexShrink: 1,
  },
  chartHint: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    flexShrink: 0,
    marginLeft: 10,
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 160, // MAX_BAR_HEIGHT + 40
  },
  yAxisContainer: {
    width: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#eee',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
    paddingTop: 10,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 120, // MAX_BAR_HEIGHT
    position: 'relative',
  },
  bar: {
    width: 25,
    borderRadius: 3,
    minHeight: 2,
  },
  barValue: {
    position: 'absolute',
    top: -15,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  dateLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  legendContainer: {
    marginTop: 20,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    width: '48%',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
  },
  tipsContainer: {
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
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default HomeScreen; 