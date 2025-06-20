import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const LogsScreen = ({ navigation }) => {
  // Mock data for demonstration - in a real app this would come from storage/database
  const [foodLogs, setFoodLogs] = React.useState([
    {
      id: '1',
      foodItem: 'Salmon Fillet',
      date: '2024-01-15',
      time: '12:30 PM',
      microplasticsCount: 3,
      status: 'analyzed',
    },
    {
      id: '2',
      foodItem: 'Tuna Sashimi',
      date: '2024-01-14',
      time: '7:45 PM',
      microplasticsCount: 7,
      status: 'analyzed',
    },
    {
      id: '3',
      foodItem: 'Grilled Chicken',
      date: '2024-01-14',
      time: '1:15 PM',
      microplasticsCount: 0,
      status: 'analyzed',
    },
    {
      id: '4',
      foodItem: 'Sea Bass',
      date: '2024-01-13',
      time: '6:20 PM',
      microplasticsCount: 5,
      status: 'analyzed',
    },
    {
      id: '5',
      foodItem: 'Shrimp Salad',
      date: '2024-01-12',
      time: '12:00 PM',
      microplasticsCount: 12,
      status: 'analyzed',
    },
  ]);

  const getMicroplasticsColor = (count) => {
    if (count === 0) return '#34C759'; // Green for no microplastics
    if (count <= 3) return '#FF9500'; // Orange for low count
    if (count <= 7) return '#FF6B35'; // Red-orange for medium count
    return '#FF3B30'; // Red for high count
  };

  const getMicroplasticsLevel = (count) => {
    if (count === 0) return 'Clean';
    if (count <= 3) return 'Low';
    if (count <= 7) return 'Medium';
    return 'High';
  };

  const renderLogItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.logItem}
      onPress={() => navigation.navigate('FoodDetail', { foodItem: item })}
      activeOpacity={0.7}
    >
      <View style={styles.logHeader}>
        <Text style={styles.foodName}>{item.foodItem}</Text>
        <View style={styles.rightSection}>
          <View style={[
            styles.countBadge,
            { backgroundColor: getMicroplasticsColor(item.microplasticsCount) }
          ]}>
            <Text style={styles.countText}>{item.microplasticsCount}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
      
      <View style={styles.logDetails}>
        <Text style={styles.dateTime}>{item.date} at {item.time}</Text>
        <Text style={[
          styles.levelText,
          { color: getMicroplasticsColor(item.microplasticsCount) }
        ]}>
          {getMicroplasticsLevel(item.microplasticsCount)} contamination
        </Text>
      </View>
      
      <Text style={styles.microplasticsText}>
        {item.microplasticsCount === 0 
          ? 'No microplastics detected' 
          : `${item.microplasticsCount} microplastic particle${item.microplasticsCount > 1 ? 's' : ''} found`
        }
      </Text>
      
      <Text style={styles.tapHint}>Tap for details</Text>
    </TouchableOpacity>
  );

  const totalMicroplastics = foodLogs.reduce((sum, log) => sum + log.microplasticsCount, 0);
  const averageMicroplastics = foodLogs.length > 0 ? (totalMicroplastics / foodLogs.length).toFixed(1) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Food Scan Logs</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{foodLogs.length}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalMicroplastics}</Text>
            <Text style={styles.statLabel}>Total Particles</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{averageMicroplastics}</Text>
            <Text style={styles.statLabel}>Avg per Scan</Text>
          </View>
        </View>
      </View>
      
      <FlatList
        data={foodLogs}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No food scans yet</Text>
            <Text style={styles.emptySubtext}>Start scanning your food to see logs here</Text>
          </View>
        }
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  list: {
    flex: 1,
  },
  logItem: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countBadge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  microplasticsText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  chevron: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  tapHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default LogsScreen; 