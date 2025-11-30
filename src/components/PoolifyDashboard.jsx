import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import './PoolifyDashboard.css';

// Client brand colors and icons
const clientConfig = {
  'Blinkit': { bg: '#ffe900', text: '#1a1a1a', icon: '📦' },
  'Zepto': { bg: '#5c2d91', text: '#ffffff', icon: '⚡' },
  'Swiggy Instamart': { bg: '#fc8019', text: '#ffffff', icon: '🛒' },
  'Zomato': { bg: '#e23744', text: '#ffffff', icon: '🍔' },
  'Dunzo': { bg: '#00d290', text: '#ffffff', icon: '📬' }
};

function PoolifyDashboard() {
  const navigate = useNavigate();
  const { deliveryBoys, tasks, assignBestDeliveryBoy, resetData } = useData();
  const [notification, setNotification] = useState(null);

  const handleAssignment = (task) => {
    const result = assignBestDeliveryBoy(task);
    setNotification(result);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReset = () => {
    const result = resetData();
    setNotification(result);
    setTimeout(() => setNotification(null), 3000);
  };

  // Calculate stats
  const totalPersonnel = deliveryBoys.length;
  const availablePersonnel = deliveryBoys.filter(db => db.is_available).length;
  const pendingTasks = tasks.filter(task => task.status === 'PENDING');
  const activeDeliveries = tasks.filter(task => task.status === 'ASSIGNED' || task.status === 'IN_PROGRESS');

  return (
    <div className="poolify-dashboard">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.success ? 'success' : 'error'}`}>
          {notification.success ? '✅' : '❌'} {notification.message}
        </div>
      )}

      {/* Top Bar */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="brand">
            <span className="brand-icon">🚚</span>
            <div className="brand-text">
              <h1>Poolify Admin Dashboard</h1>
              <p className="subtitle">Smart Delivery Assignment Platform</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="header-btn partner-btn" onClick={() => navigate('/')}>
            <span>🏍️</span> Partner View
          </button>
          <button className="header-btn reset-btn" onClick={handleReset}>
            <span>🔄</span> Reset Data
          </button>
        </div>
      </header>

      {/* Stats Cards Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon personnel">👥</div>
          <div className="stat-info">
            <span className="stat-value">{totalPersonnel}</span>
            <span className="stat-label">Total Personnel</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon available">✅</div>
          <div className="stat-info">
            <span className="stat-value">{availablePersonnel}/{totalPersonnel}</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">📋</div>
          <div className="stat-info">
            <span className="stat-value">{pendingTasks.length}</span>
            <span className="stat-label">Pending Tasks</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">🚀</div>
          <div className="stat-info">
            <span className="stat-value">{activeDeliveries.length}</span>
            <span className="stat-label">Active Deliveries</span>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="dashboard-content">
        {/* Left Column: Pending Tasks */}
        <section className="panel pending-tasks-panel">
          <div className="panel-header">
            <h2>📋 Pending Tasks</h2>
            <span className="count-badge">{pendingTasks.length} pending</span>
          </div>
          
          {pendingTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <p>No pending tasks! All tasks have been assigned.</p>
            </div>
          ) : (
            <div className="task-list">
              {pendingTasks.map(task => {
                const clientStyle = clientConfig[task.client_name] || { bg: '#e9ecef', text: '#333', icon: '📦' };
                return (
                  <div key={task.request_id} className="task-card">
                    <div className="task-top">
                      <div className="task-client">
                        <span 
                          className="client-badge"
                          style={{ background: clientStyle.bg, color: clientStyle.text }}
                        >
                          {clientStyle.icon} {task.client_name}
                        </span>
                        <span className="request-id">{task.request_id}</span>
                      </div>
                      <span className="status-badge pending">PENDING</span>
                    </div>
                    
                    <div className="task-route">
                      <div className="route-point">
                        <span className="route-icon pickup">📦</span>
                        <span className="route-text">{task.pickup_location}</span>
                      </div>
                      <span className="route-arrow">→</span>
                      <div className="route-point">
                        <span className="route-icon dropoff">🏠</span>
                        <span className="route-text">{task.dropoff_location}</span>
                      </div>
                    </div>

                    <div className="task-bottom">
                      <div className="task-meta">
                        <span className="customer">👤 {task.customer_name}</span>
                        <span className="order-value">₹{task.order_value}</span>
                      </div>
                      <button 
                        className="assign-btn"
                        onClick={() => handleAssignment(task)}
                      >
                        Run Assignment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Tasks */}
          {activeDeliveries.length > 0 && (
            <>
              <div className="panel-header section-divider">
                <h3>✅ Active Tasks</h3>
                <span className="count-badge success">{activeDeliveries.length} active</span>
              </div>
              <div className="task-list">
                {activeDeliveries.map(task => {
                  const clientStyle = clientConfig[task.client_name] || { bg: '#e9ecef', text: '#333', icon: '📦' };
                  const assignedDb = deliveryBoys.find(db => db.db_id === task.assigned_to);
                  return (
                    <div key={task.request_id} className="task-card active">
                      <div className="task-top">
                        <div className="task-client">
                          <span 
                            className="client-badge"
                            style={{ background: clientStyle.bg, color: clientStyle.text }}
                          >
                            {clientStyle.icon} {task.client_name}
                          </span>
                          <span className="request-id">{task.request_id}</span>
                        </div>
                        <span className={`status-badge ${task.status.toLowerCase().replace('_', '-')}`}>
                          {task.status === 'IN_PROGRESS' ? '🚀 IN PROGRESS' : '✅ ASSIGNED'}
                        </span>
                      </div>
                      
                      <div className="task-route">
                        <div className="route-point">
                          <span className="route-icon pickup">📦</span>
                          <span className="route-text">{task.pickup_location}</span>
                        </div>
                        <span className="route-arrow">→</span>
                        <div className="route-point">
                          <span className="route-icon dropoff">🏠</span>
                          <span className="route-text">{task.dropoff_location}</span>
                        </div>
                      </div>

                      {assignedDb && (
                        <div className="assigned-info">
                          <img 
                            src={assignedDb.avatar} 
                            alt={assignedDb.name}
                            className="assigned-avatar"
                          />
                          <span className="assigned-name">Assigned to: {assignedDb.name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* Right Column: Delivery Personnel */}
        <section className="panel delivery-boys-panel">
          <div className="panel-header">
            <h2>👥 Delivery Personnel</h2>
            <span className="count-badge">{availablePersonnel}/{totalPersonnel} available</span>
          </div>
          
          <div className="delivery-boy-list">
            {deliveryBoys.map(db => (
              <Link 
                key={db.db_id} 
                to={`/partner/${db.db_id}`}
                className={`delivery-boy-card ${db.is_available ? 'available' : 'busy'}`}
              >
                <img 
                  src={db.avatar} 
                  alt={db.name}
                  className="db-avatar"
                />
                <div className="db-info">
                  <div className="db-main">
                    <span className="db-name">{db.name}</span>
                    <span className="db-id">DB{String(db.db_id).padStart(3, '0')}</span>
                  </div>
                  <div className="db-location">
                    <span className="location-icon">📍</span>
                    <span className="location-text">{db.current_location}</span>
                  </div>
                  {db.assigned_request_id && (
                    <div className="db-task">
                      <span className="task-icon">📋</span>
                      <span className="task-text">{db.assigned_request_id}</span>
                    </div>
                  )}
                </div>
                <span className={`availability-badge ${db.is_available ? 'available' : 'busy'}`}>
                  {db.is_available ? 'AVAILABLE' : 'BUSY'}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>💡 Open browser console (F12) to see assignment logic details</p>
        <p className="copyright">Poolify v2.0 - Warehouse-Based Delivery System</p>
      </footer>
    </div>
  );
}

export default PoolifyDashboard;
