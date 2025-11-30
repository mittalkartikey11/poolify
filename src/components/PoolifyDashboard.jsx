import { useState } from 'react';
import './PoolifyDashboard.css';

// Initial Mock Data - Delivery Boys
const initialDeliveryBoys = [
  { db_id: 1, name: "Rajesh Kumar", current_society: "Green Valley", is_available: true, assigned_request_id: null },
  { db_id: 2, name: "Amit Sharma", current_society: "Palm Heights", is_available: true, assigned_request_id: null },
  { db_id: 3, name: "Vikram Singh", current_society: "Sunrise Apartments", is_available: false, assigned_request_id: null },
  { db_id: 4, name: "Suresh Patel", current_society: "Green Valley", is_available: true, assigned_request_id: null },
  { db_id: 5, name: "Rohit Gupta", current_society: "Oak Gardens", is_available: true, assigned_request_id: null }
];

// Initial Mock Data - Tasks (Requests)
const initialTasks = [
  { request_id: 101, client_name: "Blinkit", pickup_society: "Green Valley", dropoff_society: "Palm Heights", status: "PENDING" },
  { request_id: 102, client_name: "Swiggy", pickup_society: "Sunrise Apartments", dropoff_society: "Green Valley", status: "PENDING" },
  { request_id: 103, client_name: "Zomato", pickup_society: "Palm Heights", dropoff_society: "Oak Gardens", status: "PENDING" },
  { request_id: 104, client_name: "Dunzo", pickup_society: "Oak Gardens", dropoff_society: "Sunrise Apartments", status: "PENDING" }
];

function PoolifyDashboard() {
  const [deliveryBoys, setDeliveryBoys] = useState(initialDeliveryBoys);
  const [tasks, setTasks] = useState(initialTasks);

  /**
   * Core Assignment Function
   * Assigns the best available delivery boy to a task based on priority logic
   * Priority 1: Delivery boy at dropoff location (OPTIMAL - no fuel needed for delivery)
   * Priority 2: Delivery boy at pickup location (closest to start point)
   */
  const assignBestDeliveryBoy = (task) => {
    console.log(`\n=== Assignment Logic for Request #${task.request_id} ===`);
    console.log(`Task: ${task.client_name} | Pickup: ${task.pickup_society} | Dropoff: ${task.dropoff_society}`);

    // Filter available delivery boys
    const availableDeliveryBoys = deliveryBoys.filter(db => db.is_available);
    console.log(`Available Delivery Boys: ${availableDeliveryBoys.map(db => db.name).join(', ') || 'None'}`);

    if (availableDeliveryBoys.length === 0) {
      console.log('❌ No available delivery boys. Assignment failed.');
      alert('No available delivery boys at the moment!');
      return;
    }

    let selectedDeliveryBoy = null;
    let matchPriority = null;

    // Priority 1: Find delivery boy at dropoff location (OPTIMAL match)
    const priority1Match = availableDeliveryBoys.find(
      db => db.current_society === task.dropoff_society
    );

    if (priority1Match) {
      selectedDeliveryBoy = priority1Match;
      matchPriority = 1;
      console.log(`✅ Priority 1 Match Found: ${selectedDeliveryBoy.name} is at ${task.dropoff_society} (dropoff location)`);
      console.log('   → OPTIMAL: Delivery boy is already at final destination - Maximum fuel saving!');
    } else {
      console.log(`⚠️ Priority 1: No delivery boy found at dropoff location (${task.dropoff_society})`);
      
      // Priority 2: Find delivery boy at pickup location
      const priority2Match = availableDeliveryBoys.find(
        db => db.current_society === task.pickup_society
      );

      if (priority2Match) {
        selectedDeliveryBoy = priority2Match;
        matchPriority = 2;
        console.log(`✅ Priority 2 Match Found: ${selectedDeliveryBoy.name} is at ${task.pickup_society} (pickup location)`);
        console.log('   → GOOD: Delivery boy is at pickup point - Saves travel to pickup!');
      } else {
        console.log(`⚠️ Priority 2: No delivery boy found at pickup location (${task.pickup_society})`);
      }
    }

    // If no match found based on priorities
    if (!selectedDeliveryBoy) {
      console.log('❌ No matching delivery boy found based on priority rules.');
      alert(`No suitable delivery boy found for this task. No one is at ${task.pickup_society} or ${task.dropoff_society}.`);
      return;
    }

    // Update state with assignment
    console.log(`\n📋 Assigning Request #${task.request_id} to ${selectedDeliveryBoy.name} (Priority ${matchPriority} match)`);

    // Update delivery boys state
    setDeliveryBoys(prevDeliveryBoys => 
      prevDeliveryBoys.map(db => 
        db.db_id === selectedDeliveryBoy.db_id
          ? { ...db, is_available: false, assigned_request_id: task.request_id }
          : db
      )
    );

    // Update tasks state
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.request_id === task.request_id
          ? { ...t, status: 'ASSIGNED' }
          : t
      )
    );

    console.log(`✅ Assignment Complete! ${selectedDeliveryBoy.name} is now busy with Request #${task.request_id}\n`);
  };

  // Filter pending tasks
  const pendingTasks = tasks.filter(task => task.status === 'PENDING');
  const assignedTasks = tasks.filter(task => task.status === 'ASSIGNED');

  return (
    <div className="poolify-dashboard">
      <header className="dashboard-header">
        <h1>🚚 Poolify Admin Dashboard</h1>
        <p className="tagline">Intelligent Delivery Assignment System</p>
      </header>

      <div className="dashboard-content">
        {/* Pending Tasks Panel */}
        <section className="panel pending-tasks-panel">
          <h2>📦 Pending Tasks</h2>
          <p className="panel-description">Click &quot;Run Assignment&quot; to assign a delivery boy</p>
          
          {pendingTasks.length === 0 ? (
            <div className="empty-state">
              <p>✨ No pending tasks! All tasks have been assigned.</p>
            </div>
          ) : (
            <div className="task-list">
              {pendingTasks.map(task => (
                <div key={task.request_id} className="task-card pending">
                  <div className="task-info">
                    <div className="task-header">
                      <span className="request-id">#{task.request_id}</span>
                      <span className="client-name">{task.client_name}</span>
                    </div>
                    <div className="task-details">
                      <div className="location">
                        <span className="label">Pickup:</span>
                        <span className="value">{task.pickup_society}</span>
                      </div>
                      <span className="arrow">→</span>
                      <div className="location">
                        <span className="label">Dropoff:</span>
                        <span className="value">{task.dropoff_society}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="assign-btn"
                    onClick={() => assignBestDeliveryBoy(task)}
                  >
                    Run Assignment
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Show assigned tasks */}
          {assignedTasks.length > 0 && (
            <>
              <h3 className="assigned-header">✅ Assigned Tasks</h3>
              <div className="task-list assigned-list">
                {assignedTasks.map(task => (
                  <div key={task.request_id} className="task-card assigned">
                    <div className="task-info">
                      <div className="task-header">
                        <span className="request-id">#{task.request_id}</span>
                        <span className="client-name">{task.client_name}</span>
                        <span className="status-badge">ASSIGNED</span>
                      </div>
                      <div className="task-details">
                        <div className="location">
                          <span className="label">Pickup:</span>
                          <span className="value">{task.pickup_society}</span>
                        </div>
                        <span className="arrow">→</span>
                        <div className="location">
                          <span className="label">Dropoff:</span>
                          <span className="value">{task.dropoff_society}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Delivery Boy Status Panel */}
        <section className="panel delivery-boys-panel">
          <h2>🏍️ Delivery Personnel</h2>
          <p className="panel-description">Real-time status of all delivery personnel</p>
          
          <div className="delivery-boy-list">
            {deliveryBoys.map(db => (
              <div 
                key={db.db_id} 
                className={`delivery-boy-card ${db.is_available ? 'available' : 'busy'}`}
              >
                <div className="db-main-info">
                  <div className="db-name">{db.name}</div>
                  <span className={`availability-badge ${db.is_available ? 'available' : 'busy'}`}>
                    {db.is_available ? '✅ Available' : '🔴 Busy'}
                  </span>
                </div>
                <div className="db-details">
                  <div className="db-location">
                    <span className="label">📍 Current Location:</span>
                    <span className="value">{db.current_society}</span>
                  </div>
                  {db.assigned_request_id && (
                    <div className="db-assignment">
                      <span className="label">📋 Assigned Task:</span>
                      <span className="value">#{db.assigned_request_id}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="dashboard-footer">
        <p>Poolify PoC - Intelligent Delivery Assignment System</p>
        <p className="hint">💡 Open browser console to see assignment logic details</p>
      </footer>
    </div>
  );
}

export default PoolifyDashboard;
