import { createContext, useState, useEffect, useCallback } from 'react';
import {
  initializeLocalStorage,
  getDeliveryBoys as getDeliveryBoysFromStorage,
  getTasks as getTasksFromStorage,
  assignTaskToDeliveryBoy,
  startDelivery as startDeliveryFromStorage,
  completeDelivery as completeDeliveryFromStorage,
  resetToInitialData,
  getStorageKeys
} from '../services/localStorageService';

// Create context
const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  const [deliveryBoys, setDeliveryBoys] = useState(() => {
    // Initialize localStorage on first render
    initializeLocalStorage();
    return getDeliveryBoysFromStorage();
  });
  const [tasks, setTasks] = useState(() => getTasksFromStorage());

  // Load data from localStorage
  const loadDataFromLocalStorage = useCallback(() => {
    setDeliveryBoys(getDeliveryBoysFromStorage());
    setTasks(getTasksFromStorage());
  }, []);

  // Listen for storage events (cross-tab synchronization)
  useEffect(() => {
    const storageKeys = getStorageKeys();
    
    const handleStorageChange = (e) => {
      if (e.key === storageKeys.DELIVERY_BOYS || e.key === storageKeys.TASKS) {
        console.log('📡 Storage event detected, reloading data...');
        loadDataFromLocalStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadDataFromLocalStorage]);

  /**
   * Core Assignment Function
   * Assigns the best available delivery boy to a task based on priority logic
   * Priority 1: Match delivery boy's current_location with task's pickup_location (Warehouse match)
   * Priority 2: Find any available delivery boy
   */
  const assignBestDeliveryBoy = (task) => {
    const result = assignTaskToDeliveryBoy(task.request_id);
    loadDataFromLocalStorage(); // Reload state after update
    return result;
  };

  // Start delivery - changes task status to IN_PROGRESS
  const startDelivery = (taskId) => {
    const result = startDeliveryFromStorage(taskId);
    loadDataFromLocalStorage(); // Reload state after update
    return result;
  };

  // Complete delivery - changes task status to COMPLETED and makes delivery boy available
  const completeDelivery = (taskId, dbId) => {
    const result = completeDeliveryFromStorage(taskId, dbId);
    loadDataFromLocalStorage(); // Reload state after update
    return result;
  };

  // Reset all data to initial state
  const resetData = () => {
    const result = resetToInitialData();
    loadDataFromLocalStorage(); // Reload state after reset
    return result;
  };

  // Get delivery boy by ID (from current state)
  const getDeliveryBoyById = (dbId) => {
    return deliveryBoys.find(db => db.db_id === parseInt(dbId));
  };

  // Get task by ID (from current state)
  const getTaskById = (taskId) => {
    return tasks.find(t => t.request_id === taskId);
  };

  // Get tasks assigned to a specific delivery boy (from current state)
  const getTasksForDeliveryBoy = (dbId) => {
    return tasks.filter(t => t.assigned_to === parseInt(dbId));
  };

  const value = {
    deliveryBoys,
    tasks,
    assignBestDeliveryBoy,
    startDelivery,
    completeDelivery,
    getDeliveryBoyById,
    getTaskById,
    getTasksForDeliveryBoy,
    resetData,
    loadDataFromLocalStorage
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
