// LocalStorage Service for Poolify
// Handles all data persistence operations

const STORAGE_KEYS = {
  DELIVERY_BOYS: 'poolify_delivery_boys',
  TASKS: 'poolify_tasks',
  INITIALIZED: 'poolify_initialized'
};

// Initial Mock Data - Delivery Boys stationed at client warehouses
const initialDeliveryBoys = [
  { 
    db_id: 1, 
    name: "Rahul Kumar", 
    current_location: "Blinkit Center", 
    is_available: true, 
    assigned_request_id: null, 
    avatar: "https://ui-avatars.com/api/?name=Rahul+Kumar&background=3b82f6&color=fff" 
  },
  { 
    db_id: 2, 
    name: "Amit Sharma", 
    current_location: "Swiggy Hub", 
    is_available: true, 
    assigned_request_id: null, 
    avatar: "https://ui-avatars.com/api/?name=Amit+Sharma&background=10b981&color=fff" 
  },
  { 
    db_id: 3, 
    name: "Vikram Singh", 
    current_location: "Zomato Warehouse", 
    is_available: true, 
    assigned_request_id: null, 
    avatar: "https://ui-avatars.com/api/?name=Vikram+Singh&background=f59e0b&color=fff" 
  },
  { 
    db_id: 4, 
    name: "Suresh Patel", 
    current_location: "Dunzo Center", 
    is_available: true, 
    assigned_request_id: null, 
    avatar: "https://ui-avatars.com/api/?name=Suresh+Patel&background=ef4444&color=fff" 
  },
  { 
    db_id: 5, 
    name: "Priya Desai", 
    current_location: "Blinkit Center", 
    is_available: true, 
    assigned_request_id: null, 
    avatar: "https://ui-avatars.com/api/?name=Priya+Desai&background=8b5cf6&color=fff" 
  }
];

// Initial Mock Data - Tasks (Warehouse → Society routes)
const initialTasks = [
  { 
    request_id: "REQ001", 
    client_name: "Blinkit", 
    pickup_location: "Blinkit Center",
    dropoff_location: "Sunrise Heights",
    status: "PENDING", 
    assigned_to: null, 
    customer_name: "Rohit Sharma", 
    order_value: 450 
  },
  { 
    request_id: "REQ002", 
    client_name: "Zepto", 
    pickup_location: "Zepto Hub",
    dropoff_location: "Palm Grove",
    status: "PENDING", 
    assigned_to: null, 
    customer_name: "Anjali Mehta", 
    order_value: 320 
  },
  { 
    request_id: "REQ003", 
    client_name: "Swiggy Instamart", 
    pickup_location: "Swiggy Hub",
    dropoff_location: "Green Valley",
    status: "PENDING", 
    assigned_to: null, 
    customer_name: "Karan Singh", 
    order_value: 550 
  },
  { 
    request_id: "REQ004", 
    client_name: "Zomato", 
    pickup_location: "Zomato Warehouse",
    dropoff_location: "Royal Gardens",
    status: "PENDING", 
    assigned_to: null, 
    customer_name: "Neha Kapoor", 
    order_value: 280 
  },
  { 
    request_id: "REQ005", 
    client_name: "Dunzo", 
    pickup_location: "Dunzo Center",
    dropoff_location: "Maple Woods",
    status: "PENDING", 
    assigned_to: null, 
    customer_name: "Sanjay Gupta", 
    order_value: 620 
  }
];

/**
 * Initialize localStorage with mock data if not already initialized
 */
export const initializeLocalStorage = () => {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.DELIVERY_BOYS, JSON.stringify(initialDeliveryBoys));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    console.log('✅ LocalStorage initialized with mock data');
  }
};

/**
 * Get all delivery boys from localStorage
 */
export const getDeliveryBoys = () => {
  const data = localStorage.getItem(STORAGE_KEYS.DELIVERY_BOYS);
  return data ? JSON.parse(data) : [];
};

/**
 * Get all tasks from localStorage
 */
export const getTasks = () => {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  return data ? JSON.parse(data) : [];
};

/**
 * Get a delivery boy by ID
 */
export const getDeliveryBoyById = (dbId) => {
  const deliveryBoys = getDeliveryBoys();
  return deliveryBoys.find(db => db.db_id === parseInt(dbId));
};

/**
 * Get a task by ID
 */
export const getTaskById = (taskId) => {
  const tasks = getTasks();
  return tasks.find(t => t.request_id === taskId);
};

/**
 * Update a specific delivery boy
 */
export const updateDeliveryBoy = (dbId, updates) => {
  const deliveryBoys = getDeliveryBoys();
  const updatedDeliveryBoys = deliveryBoys.map(db => 
    db.db_id === parseInt(dbId) ? { ...db, ...updates } : db
  );
  localStorage.setItem(STORAGE_KEYS.DELIVERY_BOYS, JSON.stringify(updatedDeliveryBoys));
  return updatedDeliveryBoys;
};

/**
 * Update a specific task
 */
export const updateTask = (taskId, updates) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(t => 
    t.request_id === taskId ? { ...t, ...updates } : t
  );
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
  return updatedTasks;
};

/**
 * Assign the best available delivery boy to a task
 * Priority 1: Match delivery boy's current_location with task's pickup_location (Warehouse match)
 * Priority 2: Find nearest available delivery boy (any warehouse)
 */
export const assignTaskToDeliveryBoy = (taskId) => {
  const task = getTaskById(taskId);
  if (!task) {
    console.log('❌ Task not found');
    return { success: false, message: 'Task not found' };
  }

  const availableDeliveryBoys = getDeliveryBoys().filter(db => db.is_available);
  console.log(`\n=== Assignment Logic for ${taskId} ===`);
  console.log(`Task: ${task.client_name} | Route: ${task.pickup_location} → ${task.dropoff_location}`);
  console.log(`Available Delivery Boys: ${availableDeliveryBoys.map(db => `${db.name} (${db.current_location})`).join(', ') || 'None'}`);

  if (availableDeliveryBoys.length === 0) {
    console.log('❌ No available delivery boys');
    return { success: false, message: 'No available delivery boys at the moment!' };
  }

  let selectedBoy = null;
  let matchPriority = null;

  // Priority 1: Exact warehouse match
  selectedBoy = availableDeliveryBoys.find(
    db => db.current_location === task.pickup_location
  );

  if (selectedBoy) {
    matchPriority = 1;
    console.log(`✅ Priority 1 Match: ${selectedBoy.name} is at ${task.pickup_location} (pickup warehouse)`);
  } else {
    console.log(`⚠️ Priority 1: No delivery boy at ${task.pickup_location}`);
    
    // Priority 2: Any available delivery boy
    if (availableDeliveryBoys.length > 0) {
      selectedBoy = availableDeliveryBoys[0];
      matchPriority = 2;
      console.log(`✅ Priority 2 Match: ${selectedBoy.name} (available at ${selectedBoy.current_location})`);
    }
  }

  if (selectedBoy) {
    // Update task
    updateTask(taskId, {
      status: 'ASSIGNED',
      assigned_to: selectedBoy.db_id
    });
    
    // Update delivery boy
    updateDeliveryBoy(selectedBoy.db_id, {
      is_available: false,
      assigned_request_id: taskId
    });
    
    console.log(`✅ Assigned ${taskId} to ${selectedBoy.name} (Priority ${matchPriority})\n`);
    return { 
      success: true, 
      message: `Task ${taskId} assigned to ${selectedBoy.name} (Priority ${matchPriority} match)`,
      deliveryBoy: selectedBoy,
      priority: matchPriority
    };
  }
  
  console.log('❌ No available delivery boy found');
  return { success: false, message: 'No available delivery boy found' };
};

/**
 * Start a delivery - changes task status to IN_PROGRESS
 */
export const startDelivery = (taskId) => {
  updateTask(taskId, { status: 'IN_PROGRESS' });
  console.log(`🚀 Delivery started for ${taskId}`);
  return { success: true, message: `Delivery started for ${taskId}` };
};

/**
 * Complete a delivery - changes task status to COMPLETED and makes delivery boy available
 */
export const completeDelivery = (taskId, dbId) => {
  const task = getTaskById(taskId);
  
  updateTask(taskId, { status: 'COMPLETED' });
  
  updateDeliveryBoy(dbId, {
    is_available: true,
    assigned_request_id: null,
    current_location: task?.dropoff_location || getDeliveryBoyById(dbId)?.current_location
  });
  
  console.log(`✅ Delivery completed for ${taskId}. Delivery boy is now available at ${task?.dropoff_location}.`);
  return { success: true, message: `Delivery completed for ${taskId}!` };
};

/**
 * Get tasks assigned to a specific delivery boy
 */
export const getTasksForDeliveryBoy = (dbId) => {
  const tasks = getTasks();
  return tasks.filter(t => t.assigned_to === parseInt(dbId));
};

/**
 * Reset all data to initial state
 */
export const resetToInitialData = () => {
  localStorage.removeItem(STORAGE_KEYS.DELIVERY_BOYS);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  initializeLocalStorage();
  console.log('🔄 LocalStorage reset to initial data');
  return { success: true, message: 'All data has been reset to initial state!' };
};

/**
 * Get storage keys for event listeners
 */
export const getStorageKeys = () => STORAGE_KEYS;

export default {
  initializeLocalStorage,
  getDeliveryBoys,
  getTasks,
  getDeliveryBoyById,
  getTaskById,
  updateDeliveryBoy,
  updateTask,
  assignTaskToDeliveryBoy,
  startDelivery,
  completeDelivery,
  getTasksForDeliveryBoy,
  resetToInitialData,
  getStorageKeys
};
