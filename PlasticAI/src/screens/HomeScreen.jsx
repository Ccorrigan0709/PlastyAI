import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { StorageService } from '../services/storage';

const { width } = Dimensions.get('window');
const MAX_BAR_HEIGHT = 120;

const HomeScreen = ({ navigation }) => {
  const [scanData, setScanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState([]);

  // Load scan data from storage
  useEffect(() => {
    loadScanData();
  }, []);

  // Reload data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadScanData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadScanData = async () => {
    try {
      console.log('HomeScreen: Loading scan data...');
      const logs = await StorageService.getFoodLogs();
      console.log('HomeScreen: Loaded', logs.length, 'scan logs');
      
      // Filter out scans with problematic date formats
      const validLogs = logs.filter(scan => {
        if (!scan.date) return false;
        
        try {
          // Test if we can parse the date
          if (scan.date.includes('T')) {
            new Date(scan.date);
          } else {
            new Date(scan.date + ' ' + (scan.time || '00:00'));
          }
          return true;
        } catch (error) {
          console.log('HomeScreen: Filtering out scan with invalid date:', scan, error);
          return false;
        }
      });
      
      console.log('HomeScreen: Valid logs after filtering:', validLogs.length);
      setScanData(validLogs);
      generateWeeklyData(validLogs);
    } catch (error) {
      console.error('Error loading scan data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate real weekly data based on actual scan history
  const generateWeeklyData = (logs) => {
    console.log('HomeScreen: Generating weekly data from', logs.length, 'logs');
    if (logs.length > 0) {
      console.log('HomeScreen: Sample log entry:', logs[0]);
    }
    
    const now = new Date();
    console.log('HomeScreen: Current time is:', now.toISOString());
    const weekData = [];
    
    // Generate data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      console.log('HomeScreen: Checking day', date.toDateString(), 'from', dayStart.toISOString(), 'to', dayEnd.toISOString());
      
      // Filter scans for this specific day
      const dayScans = logs.filter(scan => {
        if (!scan.date) {
          console.log('HomeScreen: Scan missing date:', scan);
          return false;
        }
        
        try {
          // Handle both old format (date + time) and new format (ISO string)
          let scanDate;
          if (scan.date.includes('T')) {
            // New format: ISO string
            scanDate = new Date(scan.date);
          } else {
            // Old format: date + time strings
            scanDate = new Date(scan.date + ' ' + (scan.time || '00:00'));
          }
          
          console.log('HomeScreen: Parsed scan date:', scanDate.toISOString(), 'for scan:', scan.foodItem);
          const isInRange = scanDate >= dayStart && scanDate < dayEnd;
          console.log('HomeScreen: Is in range for', date.toDateString(), ':', isInRange);
          return isInRange;
        } catch (error) {
          console.log('HomeScreen: Error parsing date for scan:', scan, error);
          return false;
        }
      });
      
      console.log('HomeScreen: Day', date.toDateString(), 'has', dayScans.length, 'scans');
      
      // Calculate total plasticizer count for this day
      const totalPlasticizers = dayScans.reduce((sum, scan) => {
        const count = scan.plasticizerCount || scan.microplasticsCount || 0;
        console.log('HomeScreen: Adding', count, 'from scan:', scan.foodItem);
        return sum + count;
      }, 0);
      
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayLabel = dayLabels[date.getDay()];
      const dateLabel = date.getDate().toString();
      
      weekData.push({
        day: dayLabel,
        count: totalPlasticizers,
        date: dateLabel,
        scanCount: dayScans.length
      });
      
      console.log('HomeScreen: Added day data:', { day: dayLabel, count: totalPlasticizers, scanCount: dayScans.length });
    }
    
    console.log('HomeScreen: Final weekly data:', weekData);
    setWeeklyData(weekData);
  };

  const maxCount = weeklyData.length > 0 ? Math.max(...weeklyData.map(item => item.count)) : 0;

  const getContaminationColor = (count) => {
    if (count === 0) return '#34C759'; // Green - Clean
    if (count <= 20000) return '#34C759'; // Green - Low (no concern)
    if (count <= 50000) return '#FF9500'; // Orange - Low (minimal concern)
    if (count <= 100000) return '#FF6B35'; // Red-orange - Medium (moderate concern)
    if (count <= 150000) return '#FF3B30'; // Red - High (high concern)
    return '#8B0000'; // Dark red - Very high (very high concern)
  };

  const getContaminationLevel = (count) => {
    if (count === 0) return 'Clean';
    if (count <= 20000) return 'Low';
    if (count <= 50000) return 'Low';
    if (count <= 100000) return 'Medium';
    if (count <= 150000) return 'High';
    return 'Very High';
  };

  const totalWeekly = weeklyData.reduce((sum, day) => sum + day.count, 0);
  const averageDaily = weeklyData.length > 0 ? (totalWeekly / 7).toFixed(0) : 0;
  const totalScans = weeklyData.reduce((sum, day) => sum + day.scanCount, 0);

  const renderBarChart = () => {
    // Show loading state
    if (loading) {
      return (
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Microplastics</Text>
            <Text style={styles.chartHint}>Loading your data...</Text>
          </View>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>⏳ Loading your scan history...</Text>
          </View>
        </View>
      );
    }

    // Show no data state
    if (scanData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Microplastics</Text>
            <Text style={styles.chartHint}>Start scanning to see your data</Text>
          </View>
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataIcon}>📊</Text>
            <Text style={styles.noDataText}>No scan data yet</Text>
            <Text style={styles.noDataSubtext}>Take your first food scan to see your weekly exposure!</Text>
          </View>
        </View>
      );
    }

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
            <Text style={styles.yAxisLabel}>{maxCount > 0 ? maxCount.toLocaleString() : '0'}</Text>
            <Text style={styles.yAxisLabel}>{maxCount > 0 ? Math.round(maxCount * 0.75).toLocaleString() : '0'}</Text>
            <Text style={styles.yAxisLabel}>{maxCount > 0 ? Math.round(maxCount * 0.5).toLocaleString() : '0'}</Text>
            <Text style={styles.yAxisLabel}>{maxCount > 0 ? Math.round(maxCount * 0.25).toLocaleString() : '0'}</Text>
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
                        <Text style={styles.barValue}>
                          {item.count > 1000 ? (item.count / 1000).toFixed(1) + 'k' : item.count.toLocaleString()}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.dayLabel}>{item.day}</Text>
                    <Text style={styles.dateLabel}>{item.date}</Text>
                    {item.scanCount > 0 && (
                      <Text style={styles.scanCount}>{item.scanCount} scans</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        
        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Contamination Levels (ng/serving):</Text>
          <View style={styles.legendItems}>
            {[
              { level: 'Clean', color: '#34C759', range: '0' },
              { level: 'Very Low', color: '#34C759', range: '1-20k' },
              { level: 'Low', color: '#FF9500', range: '20k-50k' },
              { level: 'Medium', color: '#FF6B35', range: '50k-100k' },
              { level: 'High', color: '#FF3B30', range: '100k-150k' },
              { level: 'Very High', color: '#8B0000', range: '150k+' },
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
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={() => {
                console.log('HomeScreen: Manual refresh triggered');
                setLoading(true);
                loadScanData();
              }}
            >
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={async () => {
                console.log('HomeScreen: Clearing all data');
                await StorageService.clearAllLogs();
                setScanData([]);
                setWeeklyData([]);
                console.log('HomeScreen: All data cleared');
              }}
            >
              <Text style={styles.clearButtonText}>🗑️ Clear Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>This Week's Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {totalWeekly > 1000 ? (totalWeekly / 1000).toFixed(1) + 'k' : totalWeekly.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total ng/serving</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {averageDaily > 1000 ? (averageDaily / 1000).toFixed(1) + 'k' : averageDaily.toLocaleString()}
              </Text>
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
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#007AFF' }]}>
                {totalScans}
              </Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
          </View>
        </View>

        {/* Bar Chart */}
        {renderBarChart()}

        {/* Health Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Health Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>
              {scanData.length === 0 
                ? "Start scanning your food to track your microplastics exposure and get personalized insights!"
                : (() => {
                    const avgExposure = parseFloat(averageDaily);
                    if (avgExposure > 150000) {
                      return 'Your exposure is very high. Focus on reducing processed meats and high-contamination foods.';
                    } else if (avgExposure > 100000) {
                      return 'Your exposure is high. Consider choosing lower-contamination alternatives.';
                    } else if (avgExposure > 50000) {
                      return 'Your exposure is moderate. Focus on reducing high-exposure foods.';
                    } else {
                      return 'Your exposure is relatively low. Keep up the good choices!';
                    }
                  })()
              }
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Choose fresh, unpackaged foods when possible</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Avoid heating food in plastic containers</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Use glass or ceramic containers for storage</Text>
          </View>
          
          {scanData.length > 0 && totalScans < 7 && (
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• Scan more foods this week to get better trend data</Text>
            </View>
          )}
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
  refreshButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: '#FF3B30', // Red color for clear data
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
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
  scanCount: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default HomeScreen; 