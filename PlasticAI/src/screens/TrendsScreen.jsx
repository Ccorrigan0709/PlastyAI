import React, { useState } from 'react';
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

const TrendsScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last Week');

  // Simulate user's app start date (in a real app, this would come from user data)
  const userStartDate = new Date('2024-01-15'); // User started 1 week ago
  const currentDate = new Date('2024-01-22');
  const daysSinceStart = Math.floor((currentDate - userStartDate) / (1000 * 60 * 60 * 24));

  // All periods are always available to select
  const availablePeriods = ['Last Week', 'Last Month', 'Last Year', 'Last 5 Years'];

  // Generate realistic data based on available time
  const generateRealisticData = (period) => {
    const dataPoints = {
      'Last Week': daysSinceStart >= 7 ? [
        { label: 'Mon', value: 12, date: 'Jan 15' },
        { label: 'Tue', value: 3, date: 'Jan 16' },
        { label: 'Wed', value: 8, date: 'Jan 17' },
        { label: 'Thu', value: 0, date: 'Jan 18' },
        { label: 'Fri', value: 15, date: 'Jan 19' },
        { label: 'Sat', value: 5, date: 'Jan 20' },
        { label: 'Sun', value: 2, date: 'Jan 21' },
      ] : [],
      'Last Month': daysSinceStart >= 30 ? [
        { label: 'Week 1', value: 45, date: 'Dec 25-31' },
        { label: 'Week 2', value: 32, date: 'Jan 1-7' },
        { label: 'Week 3', value: 28, date: 'Jan 8-14' },
        { label: 'Week 4', value: 45, date: 'Jan 15-21' },
      ] : [],
      'Last Year': daysSinceStart >= 365 ? [
        { label: 'Jan', value: 180, date: '2024' },
        { label: 'Feb', value: 165, date: '2024' },
        { label: 'Mar', value: 142, date: '2024' },
        { label: 'Apr', value: 158, date: '2024' },
        { label: 'May', value: 134, date: '2024' },
        { label: 'Jun', value: 125, date: '2024' },
        { label: 'Jul', value: 148, date: '2024' },
        { label: 'Aug', value: 162, date: '2024' },
        { label: 'Sep', value: 139, date: '2024' },
        { label: 'Oct', value: 155, date: '2024' },
        { label: 'Nov', value: 171, date: '2024' },
        { label: 'Dec', value: 145, date: '2024' },
      ] : [],
      'Last 5 Years': daysSinceStart >= 1825 ? [
        { label: '2020', value: 1850, date: 'Annual' },
        { label: '2021', value: 1720, date: 'Annual' },
        { label: '2022', value: 1580, date: 'Annual' },
        { label: '2023', value: 1420, date: 'Annual' },
        { label: '2024', value: 1680, date: 'Annual' },
      ] : [],
    };
    return dataPoints[period] || [];
  };

  const trendData = generateRealisticData(selectedPeriod);
  const maxValue = Math.max(...trendData.map(item => item.value));
  const minValue = Math.min(...trendData.map(item => item.value));

  // Calculate trend direction
  const calculateTrend = () => {
    if (trendData.length < 2) return { direction: 'stable', percentage: 0 };
    
    const firstValue = trendData[0].value;
    const lastValue = trendData[trendData.length - 1].value;
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

    // Show insufficient data message if no data available
    if (trendData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Microplastics Exposure Trend - {selectedPeriod}
          </Text>
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataIcon}>📊</Text>
            <Text style={styles.noDataTitle}>Not Enough Data</Text>
            <Text style={styles.noDataMessage}>
              {selectedPeriod === 'Last Week' && daysSinceStart < 7 && 
                `Keep scanning food for ${7 - daysSinceStart} more days to see weekly trends.`}
              {selectedPeriod === 'Last Month' && daysSinceStart < 30 && 
                `Keep scanning food for ${30 - daysSinceStart} more days to see monthly trends.`}
              {selectedPeriod === 'Last Year' && daysSinceStart < 365 && 
                `Keep scanning food for ${365 - daysSinceStart} more days to see yearly trends.`}
              {selectedPeriod === 'Last 5 Years' && daysSinceStart < 1825 && 
                `Keep scanning food for ${Math.ceil((1825 - daysSinceStart) / 365)} more years to see 5-year trends.`}
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
            <Text style={styles.yAxisLabel}>{maxValue}</Text>
            <Text style={styles.yAxisLabel}>{Math.round(maxValue * 0.75)}</Text>
            <Text style={styles.yAxisLabel}>{Math.round(maxValue * 0.5)}</Text>
            <Text style={styles.yAxisLabel}>{Math.round(maxValue * 0.25)}</Text>
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
    const total = trendData.reduce((sum, item) => sum + item.value, 0);
    const average = total / trendData.length;
    const highest = Math.max(...trendData.map(item => item.value));
    const lowest = Math.min(...trendData.map(item => item.value));

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Period Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{total}</Text>
            <Text style={styles.statLabel}>Total Particles</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{average.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Average</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#FF3B30' }]}>{highest}</Text>
            <Text style={styles.statLabel}>Highest</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#34C759' }]}>{lowest}</Text>
            <Text style={styles.statLabel}>Lowest</Text>
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
            {availablePeriods.map((period) => (
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
            You've been tracking for {daysSinceStart} days
          </Text>
          
          <View style={styles.milestonesContainer}>
            <View style={styles.milestoneGrid}>
              <View style={[styles.milestone, daysSinceStart >= 7 ? styles.milestoneUnlocked : styles.milestoneLocked]}>
                <Text style={styles.milestoneIcon}>{daysSinceStart >= 7 ? '✅' : '🔒'}</Text>
                <Text style={styles.milestoneText}>Weekly Trends</Text>
                <Text style={styles.milestoneSubtext}>{daysSinceStart >= 7 ? 'Unlocked!' : `${7 - daysSinceStart} days left`}</Text>
              </View>
              
              <View style={[styles.milestone, daysSinceStart >= 30 ? styles.milestoneUnlocked : styles.milestoneLocked]}>
                <Text style={styles.milestoneIcon}>{daysSinceStart >= 30 ? '✅' : '🔒'}</Text>
                <Text style={styles.milestoneText}>Monthly Trends</Text>
                <Text style={styles.milestoneSubtext}>{daysSinceStart >= 30 ? 'Unlocked!' : `${30 - daysSinceStart} days left`}</Text>
              </View>
              
              <View style={[styles.milestone, daysSinceStart >= 365 ? styles.milestoneUnlocked : styles.milestoneLocked]}>
                <Text style={styles.milestoneIcon}>{daysSinceStart >= 365 ? '✅' : '🔒'}</Text>
                <Text style={styles.milestoneText}>Yearly Trends</Text>
                <Text style={styles.milestoneSubtext}>{daysSinceStart >= 365 ? 'Unlocked!' : `${365 - daysSinceStart} days left`}</Text>
              </View>
              
              <View style={[styles.milestone, daysSinceStart >= 1825 ? styles.milestoneUnlocked : styles.milestoneLocked]}>
                <Text style={styles.milestoneIcon}>{daysSinceStart >= 1825 ? '✅' : '🔒'}</Text>
                <Text style={styles.milestoneText}>5-Year Trends</Text>
                <Text style={styles.milestoneSubtext}>{daysSinceStart >= 1825 ? 'Unlocked!' : `${Math.ceil((1825 - daysSinceStart) / 365)} years left`}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>💡 Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              • Your exposure is {trend.direction === 'decreasing' ? 'improving' : trend.direction === 'increasing' ? 'worsening' : 'stable'} compared to the start of this period
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              • {selectedPeriod === 'Last Week' ? 'Consider meal planning to reduce high-exposure days' : 
                 selectedPeriod === 'Last Month' ? 'Look for patterns in weekly consumption' :
                 'Long-term trends help identify lifestyle changes'}
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              • Focus on reducing consumption of high-contamination foods like shellfish and large fish
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