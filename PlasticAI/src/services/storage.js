import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'food_scan_logs';

export const StorageService = {
  // Save a new food scan log
  async saveFoodScan(foodScan) {
    try {
      // Get existing logs
      const existingLogs = await this.getFoodLogs();
      
      // Add new log with unique ID and timestamp
      const now = new Date();
      const newLog = {
        id: Date.now().toString(),
        ...foodScan,
        date: now.toISOString(), // Use ISO format for reliable parsing
        status: 'analyzed'
      };
      
      // Add to beginning of array (most recent first)
      const updatedLogs = [newLog, ...existingLogs];
      
      // Save back to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
      
      console.log('StorageService: Saved new log:', newLog);
      return newLog;
    } catch (error) {
      console.error('Error saving food scan:', error);
      throw error;
    }
  },

  // Get all food scan logs
  async getFoodLogs() {
    try {
      const logs = await AsyncStorage.getItem(STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error getting food logs:', error);
      return [];
    }
  },

  // Clear all food scan logs
  async clearAllLogs() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('StorageService: All logs cleared');
      return true;
    } catch (error) {
      console.error('Error clearing logs:', error);
      return false;
    }
  },

  // Delete a specific log
  async deleteLog(logId) {
    try {
      const logs = await this.getFoodLogs();
      const updatedLogs = logs.filter(log => log.id !== logId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error deleting log:', error);
      throw error;
    }
  }
}; 