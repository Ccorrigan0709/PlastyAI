import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StorageService } from '../services/storage';

const { width } = Dimensions.get('window');

const TrendsScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last Week');
  const [scanData, setScanData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const logs = await StorageService.getFoodLogs();
      setScanData(logs);
    } catch (error) {
      console.error('Error loading scan data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate real data based on actual scan history
  const generateRealData = (period) => {
    if (scanData.length === 0) return [];

    const now = new Date();
    const dataPoints = [];

    switch (period) {
      case 'Last Week':
        // Group by day for the last 7 days, with today on the left
        for (let i = 0; i <= 6; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - (6 - i)); // Start from 6 days ago, end with today
          const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
          
          const dayScans = scanData.filter(scan => {
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
              return scanDate >= dayStart && scanDate < dayEnd;
            } catch (error) {
              console.log('TrendsScreen: Error parsing date for scan:', scan, error);
              return false;
            }
          });
          
          const totalPlasticizers = dayScans.reduce((sum, scan) => 
            sum + (scan.plasticizerCount || scan.microplasticsCount || 0), 0
          );
          
          const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const dayLabel = dayLabels[date.getDay()];
          const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          dataPoints.push({
            label: dayLabel,
            value: totalPlasticizers,
            date: dateLabel,
            scanCount: dayScans.length
          });
        }
        break;

      case 'Last Month':
        // Group by week for the last 4 weeks, with current week on the left
        for (let i = 0; i <= 3; i++) {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (3 - i) * 7);
          const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          const weekScans = scanData.filter(scan => {
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
              return scanDate >= weekStart && scanDate < weekEnd;
            } catch (error) {
              console.log('TrendsScreen: Error parsing date for scan:', scan, error);
              return false;
            }
          });
          
          const totalPlasticizers = weekScans.reduce((sum, scan) => 
            sum + (scan.plasticizerCount || scan.microplasticsCount || 0), 0
          );
          
          const weekStartLabel = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const weekEndLabel = new Date(weekEnd.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          dataPoints.push({
            label: `Week ${4 - i}`,
            value: totalPlasticizers,
            date: `${weekStartLabel}-${weekEndLabel}`,
            scanCount: weekScans.length
          });
        }
        break;

      case 'Last Year':
        // Group by month for the last 12 months, with current month on the left
        for (let i = 0; i <= 11; i++) {
          const monthStart = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
          const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
          
          const monthScans = scanData.filter(scan => {
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
              return scanDate >= monthStart && scanDate < monthEnd;
            } catch (error) {
              console.log('TrendsScreen: Error parsing date for scan:', scan, error);
              return false;
            }
          });
          
          const totalPlasticizers = monthScans.reduce((sum, scan) => 
            sum + (scan.plasticizerCount || scan.microplasticsCount || 0), 0
          );
          
          const monthLabel = monthStart.toLocaleDateString('en-US', { month: 'short' });
          
          dataPoints.push({
            label: monthLabel,
            value: totalPlasticizers,
            date: monthStart.getFullYear().toString(),
            scanCount: monthScans.length
          });
        }
        break;

      case 'Last 5 Years':
        // Group by year for the last 5 years, with current year on the left
        for (let i = 0; i <= 4; i++) {
          const yearStart = new Date(now.getFullYear() - (4 - i), 0, 1);
          const yearEnd = new Date(now.getFullYear() - (4 - i) + 1, 0, 1);
          
          const yearScans = scanData.filter(scan => {
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
              return scanDate >= yearStart && scanDate < yearEnd;
            } catch (error) {
              console.log('TrendsScreen: Error parsing date for scan:', scan, error);
              return false;
            }
          });
          
          const totalPlasticizers = yearScans.reduce((sum, scan) => 
            sum + (scan.plasticizerCount || scan.microplasticsCount || 0), 0
          );
          
          dataPoints.push({
            label: yearStart.getFullYear().toString(),
            value: totalPlasticizers,
            date: 'Annual',
            scanCount: yearScans.length
          });
        }
        break;
    }

    return dataPoints;
  };

  const trendData = generateRealData(selectedPeriod);
  const maxValue = trendData.length > 0 ? Math.max(...trendData.map(item => item.value)) : 0;
  const minValue = trendData.length > 0 ? Math.min(...trendData.map(item => item.value)) : 0;

  // Calculate trend direction based on real data
  const calculateTrend = () => {
    if (trendData.length < 2) return { direction: 'stable', percentage: 0 };
    
    const firstValue = trendData[0].value;
    const lastValue = trendData[trendData.length - 1].value;
    
    if (firstValue === 0) {
      return lastValue > 0 ? { direction: 'increasing', percentage: 100 } : { direction: 'stable', percentage: 0 };
    }
    
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    if (Math.abs(change) < 5) return { direction: 'stable', percentage: change };
    return { 
      direction: change > 0 ? 'increasing' : 'decreasing', 
      percentage: Math.abs(change) 
    };
  };

  const trend = calculateTrend();

  const getTrendColor = (direction) => {
    switch (direction) {
      case 'increasing': return '#FF3B30';
      case 'decreasing': return '#34C759';
      default: return '#FF9500';
    }
  };

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const renderChart = () => {
    const chartHeight = 200;
    const chartWidth = width - 100;
    const padding = 40;

    // Show loading state
    if (loading) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Microplastics Exposure Trend - {selectedPeriod}
          </Text>
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataIcon}>⏳</Text>
            <Text style={styles.noDataTitle}>Loading Data...</Text>
            <Text style={styles.noDataMessage}>
              Fetching your scan history to generate trends.
            </Text>
          </View>
        </View>
      );
    }

    // Show insufficient data message if no data available
    if (trendData.length === 0 || scanData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Microplastics Exposure Trend - {selectedPeriod}
          </Text>
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataIcon}>📊</Text>
            <Text style={styles.noDataTitle}>No Data Available</Text>
            <Text style={styles.noDataMessage}>
              {scanData.length === 0 
                ? "You haven't scanned any food items yet. Start scanning to see your exposure trends!"
                : `You need more scan data to see ${selectedPeriod.toLowerCase()} trends. Keep scanning food items!`
              }
            </Text>
            <Text style={styles.noDataHint}>
              💡 Scan more food items to unlock detailed trend analysis!
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          Microplastics Exposure Trend - {selectedPeriod}
        </Text>

        {/* Chart */}
        <View style={styles.chartWrapper}>
          {/* Y-axis labels */}
          <View style={styles.yAxisContainer}>
            <Text style={styles.yAxisLabel}>{maxValue.toLocaleString()}</Text>
            <Text style={styles.yAxisLabel}>{Math.round(maxValue * 0.75).toLocaleString()}</Text>
            <Text style={styles.yAxisLabel}>{Math.round(maxValue * 0.5).toLocaleString()}</Text>
            <Text style={styles.yAxisLabel}>{Math.round(maxValue * 0.25).toLocaleString()}</Text>
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
            
            {/* SVG-like trend line using Views */}
            <View style={styles.trendLineContainer}>
              {/* Continuous trend line */}
              {trendData.map((item, index) => {
                if (index === trendData.length - 1) return null;
                
                const x1 = (index / (trendData.length - 1)) * chartWidth;
                const y1 = chartHeight - (item.value / maxValue) * chartHeight;
                const x2 = ((index + 1) / (trendData.length - 1)) * chartWidth;
                const y2 = chartHeight - (trendData[index + 1].value / maxValue) * chartHeight;
                
                const lineWidth = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
                
                return (
                  <View
                    key={index}
                    style={[
                      styles.trendLine,
                      {
                        left: x1,
                        top: y1,
                        width: lineWidth,
                        transform: [{ rotate: `${angle}deg` }],
                      },
                    ]}
                  />
                );
              })}
            </View>
            
            {/* X-axis labels */}
            <View style={styles.xAxisLabels}>
              {trendData.map((item, index) => {
                const x = (index / (trendData.length - 1)) * chartWidth;
                return (
                  <View
                    key={index}
                    style={[
                      styles.xAxisLabelContainer,
                      {
                        left: x - 25,
                        bottom: -35,
                      },
                    ]}
                  >
                    <Text style={styles.xAxisLabel}>{item.label}</Text>
                    <Text style={styles.xAxisDate}>{item.date}</Text>
                    {item.scanCount > 0 && (
                      <Text style={styles.scanCount}>{item.scanCount} scans</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderStats = () => {
    if (trendData.length === 0) {
      return (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Period Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Total ng/serving</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Average</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Scans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
          </View>
        </View>
      );
    }

    const total = trendData.reduce((sum, item) => sum + item.value, 0);
    const average = trendData.length > 0 ? total / trendData.length : 0;
    const highest = Math.max(...trendData.map(item => item.value));
    const lowest = Math.min(...trendData.map(item => item.value));
    const totalScans = trendData.reduce((sum, item) => sum + item.scanCount, 0);

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Period Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{total.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total ng/serving</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{average.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#FF3B30' }]}>{highest.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Highest</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#34C759' }]}>{totalScans}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
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
          
          <Text style={styles.title}>Exposure Trends</Text>
          <Text style={styles.subtitle}>Track your microplastics exposure over time</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Last Week', 'Last Month', 'Last Year', 'Last 5 Years'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.selectedPeriodButton,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.selectedPeriodButtonText,
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trend Summary */}
        <View style={styles.trendSummaryContainer}>
          <View style={styles.trendSummary}>
            <Text style={styles.trendIcon}>{getTrendIcon(trend.direction)}</Text>
            <View style={styles.trendTextContainer}>
              <Text style={[styles.trendText, { color: getTrendColor(trend.direction) }]}>
                {trend.direction === 'stable' 
                  ? 'Stable exposure levels' 
                  : `${trend.direction === 'increasing' ? 'Increased' : 'Decreased'} by ${trend.percentage.toFixed(1)}%`
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        {renderChart()}

        {/* Statistics */}
        {renderStats()}

        {/* User Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>📈 Your Progress</Text>
          <Text style={styles.progressDays}>
            {scanData.length === 0 
              ? "Start scanning to track your progress!"
              : `You've scanned ${scanData.length} food items`
            }
          </Text>
          
          {scanData.length > 0 && (
            <Text style={styles.progressSubtext}>
              {(() => {
                const uniqueDays = new Set(scanData.map(scan => scan.date)).size;
                const totalPlasticizers = scanData.reduce((sum, scan) => 
                  sum + (scan.plasticizerCount || scan.microplasticsCount || 0), 0
                );
                return `Across ${uniqueDays} days • Total exposure: ${totalPlasticizers.toLocaleString()} ng/serving`;
              })()}
            </Text>
          )}
          
          <View style={styles.milestonesContainer}>
            <View style={styles.milestoneGrid}>
              <View style={[styles.milestone, scanData.length >= 7 ? styles.milestoneUnlocked : styles.milestoneLocked]}>
                <Text style={styles.milestoneIcon}>{scanData.length >= 7 ? '✅' : '🔒'}</Text>
                <Text style={styles.milestoneText}>Weekly Trends</Text>
                <Text style={styles.milestoneSubtext}>{scanData.length >= 7 ? 'Unlocked!' : `${7 - scanData.length} scans left`}</Text>
              </View>
              
              <View style={[styles.milestone, scanData.length >= 30 ? styles.milestoneUnlocked : styles.milestoneLocked]}>
                <Text style={styles.milestoneIcon}>{scanData.length >= 30 ? '✅' : '🔒'}</Text>
                <Text style={styles.milestoneText}>Monthly Trends</Text>
                <Text style={styles.milestoneSubtext}>{scanData.length >= 30 ? 'Unlocked!' : `${30 - scanData.length} scans left`}</Text>
              </View>
              
              <View style={[styles.milestone, scanData.length >= 100 ? styles.milestoneUnlocked : styles.milestoneLocked]}>
                <Text style={styles.milestoneIcon}>{scanData.length >= 100 ? '✅' : '🔒'}</Text>
                <Text style={styles.milestoneText}>Detailed Trends</Text>
                <Text style={styles.milestoneSubtext}>{scanData.length >= 100 ? 'Unlocked!' : `${100 - scanData.length} scans left`}</Text>
              </View>
              
              <View style={[styles.milestone, scanData.length >= 365 ? styles.milestoneUnlocked : styles.milestoneLocked]}>
                <Text style={styles.milestoneIcon}>{scanData.length >= 365 ? '✅' : '🔒'}</Text>
                <Text style={styles.milestoneText}>Yearly Trends</Text>
                <Text style={styles.milestoneSubtext}>{scanData.length >= 365 ? 'Unlocked!' : `${365 - scanData.length} scans left`}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>💡 Insights</Text>
          {scanData.length === 0 ? (
            <View style={styles.insightItem}>
              <Text style={styles.insightText}>
                • Start scanning your food to see personalized insights about your microplastics exposure
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  • Your exposure is {trend.direction === 'decreasing' ? 'improving' : trend.direction === 'increasing' ? 'worsening' : 'stable'} compared to the start of this period
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  • {(() => {
                    const avgPerScan = scanData.length > 0 ? 
                      scanData.reduce((sum, scan) => sum + (scan.plasticizerCount || scan.microplasticsCount || 0), 0) / scanData.length : 0;
                    if (avgPerScan > 50000) return 'Your average exposure per scan is high. Consider choosing lower-contamination alternatives.';
                    if (avgPerScan > 20000) return 'Your average exposure is moderate. Focus on reducing high-exposure foods.';
                    return 'Your average exposure is relatively low. Keep up the good choices!';
                  })()}
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  • {selectedPeriod === 'Last Week' ? 'Consider meal planning to reduce high-exposure days' : 
                     selectedPeriod === 'Last Month' ? 'Look for patterns in weekly consumption' :
                     'Long-term trends help identify lifestyle changes'}
                </Text>
              </View>
            </>
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
  periodSelector: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedPeriodButton: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedPeriodButtonText: {
    color: '#fff',
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  trendSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    minHeight: 50,
  },
  trendIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  trendTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  trendText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 280,
    marginTop: 10,
  },
  yAxisContainer: {
    width: 50,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 10,
    height: 200,
  },
  yAxisLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  chartArea: {
    flex: 1,
    height: 200,
    position: 'relative',
    marginBottom: 60,
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  trendLineContainer: {
    flex: 1,
    position: 'relative',
  },
  trendLine: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#007AFF',
    transformOrigin: 'left center',
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  xAxisLabelContainer: {
    alignItems: 'center',
  },
  xAxisLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  xAxisDate: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  scanCount: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  statsContainer: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
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
  insightsContainer: {
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
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  trendSummaryContainer: {
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noDataMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  noDataHint: {
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
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
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressDays: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  milestonesContainer: {
    marginTop: 20,
  },
  milestoneGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestone: {
    width: '24%',
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 10,
  },
  milestoneUnlocked: {
    backgroundColor: '#007AFF',
  },
  milestoneLocked: {
    backgroundColor: '#f0f0f0',
  },
  milestoneIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  milestoneText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  milestoneSubtext: {
    fontSize: 10,
    color: '#666',
  },
});

export default TrendsScreen; 