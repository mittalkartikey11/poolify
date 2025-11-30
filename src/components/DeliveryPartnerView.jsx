import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import './DeliveryPartnerView.css';

// Client brand colors and icons
const clientConfig = {
  'Blinkit': { bg: '#ffe900', text: '#1a1a1a', icon: '📦' },
  'Zepto': { bg: '#5c2d91', text: '#ffffff', icon: '⚡' },
  'Swiggy Instamart': { bg: '#fc8019', text: '#ffffff', icon: '🛒' },
  'Zomato': { bg: '#e23744', text: '#ffffff', icon: '🍔' },
  'Dunzo': { bg: '#00d290', text: '#ffffff', icon: '📬' }
};

function DeliveryPartnerView() {
  const { db_id } = useParams();
  const navigate = useNavigate();
  const { 
    deliveryBoys,
    getDeliveryBoyById, 
    getTasksForDeliveryBoy, 
    startDelivery, 
    completeDelivery,
    tasks 
  } = useData();

  const [notification, setNotification] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(db_id || '');

  const deliveryBoy = db_id ? getDeliveryBoyById(db_id) : null;
  const assignedTasks = db_id ? getTasksForDeliveryBoy(db_id) : [];
  const activeTask = assignedTasks.find(t => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS');
  const completedTasks = db_id ? tasks.filter(t => t.status === 'COMPLETED' && t.assigned_to === parseInt(db_id)) : [];

  const handleProfileChange = (e) => {
    const newId = e.target.value;
    setSelectedProfile(newId);
    if (newId) {
      navigate(`/partner/${newId}`);
    }
  };

  const handleStartDelivery = (taskId) => {
    const result = startDelivery(taskId);
    setNotification(result);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCompleteDelivery = (taskId) => {
    const result = completeDelivery(taskId, parseInt(db_id));
    setNotification(result);
    setTimeout(() => setNotification(null), 3000);
  };

  // Show profile selection if no db_id or invalid
  if (!deliveryBoy) {
    return (
      <div className="partner-view">
        {/* Notification */}
        {notification && (
          <div className={`notification ${notification.success ? 'success' : 'error'}`}>
            {notification.success ? '✅' : '❌'} {notification.message}
          </div>
        )}

        <div className="partner-container">
          {/* Header */}
          <header className="partner-header-bar">
            <div className="header-brand">
              <span className="brand-icon">🚚</span>
              <div className="brand-info">
                <h1>Delivery Partner</h1>
                <p>View and manage your deliveries</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="header-btn admin-btn" onClick={() => navigate('/admin')}>
                <span>📊</span> Admin View
              </button>
            </div>
          </header>

          {/* Profile Selection Card */}
          <div className="profile-selection-card">
            <div className="selection-icon">👤</div>
            <h2>Select Your Profile</h2>
            <div className="select-wrapper">
              <select 
                value={selectedProfile}
                onChange={handleProfileChange}
                className="profile-select"
              >
                <option value="">Choose your name to view assignments...</option>
                {deliveryBoys.map(db => (
                  <option key={db.db_id} value={db.db_id}>
                    {db.name} • {db.current_location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Welcome State */}
          <div className="welcome-state">
            <div className="welcome-icon">👤</div>
            <h2>Welcome, Delivery Partner!</h2>
            <p>Please select your profile from the dropdown above to view your assigned deliveries and manage your tasks.</p>
          </div>

          {/* Footer */}
          <footer className="partner-footer">
            <p>Poolify - Delivery Partner Portal</p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-view">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.success ? 'success' : 'error'}`}>
          {notification.success ? '✅' : '❌'} {notification.message}
        </div>
      )}

      <div className="partner-container">
        {/* Header */}
        <header className="partner-header-bar">
          <div className="header-brand">
            <span className="brand-icon">🚚</span>
            <div className="brand-info">
              <h1>Delivery Partner</h1>
              <p>View and manage your deliveries</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-btn admin-btn" onClick={() => navigate('/admin')}>
              <span>📊</span> Admin View
            </button>
          </div>
        </header>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-left">
            <img 
              src={deliveryBoy.avatar} 
              alt={deliveryBoy.name}
              className="profile-avatar"
            />
            <div className="profile-info">
              <h2>Welcome, {deliveryBoy.name}!</h2>
              <div className="profile-details">
                <span className="detail-badge location">
                  <span>📍</span> {deliveryBoy.current_location}
                </span>
                <span className={`detail-badge status ${deliveryBoy.is_available ? 'available' : 'busy'}`}>
                  {deliveryBoy.is_available ? '✅ Available' : '🔴 Busy'}
                </span>
              </div>
            </div>
          </div>
          <div className="profile-right">
            <div className="select-wrapper small">
              <select 
                value={selectedProfile}
                onChange={handleProfileChange}
                className="profile-select small"
              >
                {deliveryBoys.map(db => (
                  <option key={db.db_id} value={db.db_id}>
                    {db.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="partner-content">
          {/* Active Delivery Section */}
          {activeTask ? (
            <section className="section active-delivery-section">
              <div className="section-header">
                <h2>📦 Active Delivery</h2>
                <span className={`status-pill ${activeTask.status.toLowerCase().replace('_', '-')}`}>
                  {activeTask.status === 'ASSIGNED' && '📋 Assigned'}
                  {activeTask.status === 'IN_PROGRESS' && '🚀 In Progress'}
                </span>
              </div>

              <div className="delivery-card">
                <div className="delivery-header">
                  <span 
                    className="client-badge"
                    style={{ 
                      background: clientConfig[activeTask.client_name]?.bg || '#e9ecef',
                      color: clientConfig[activeTask.client_name]?.text || '#333'
                    }}
                  >
                    {clientConfig[activeTask.client_name]?.icon || '📦'} {activeTask.client_name}
                  </span>
                  <span className="order-id">{activeTask.request_id}</span>
                </div>

                <div className="delivery-customer">
                  <div className="customer-icon">👤</div>
                  <div className="customer-info">
                    <span className="customer-label">Customer</span>
                    <span className="customer-name">{activeTask.customer_name}</span>
                  </div>
                </div>

                <div className="delivery-route">
                  <div className="route-step pickup">
                    <div className="route-marker">📦</div>
                    <div className="route-content">
                      <span className="route-label">Pickup Location</span>
                      <span className="route-value">{activeTask.pickup_location}</span>
                    </div>
                  </div>
                  <div className="route-connector">
                    <div className="connector-line"></div>
                    <span className="connector-arrow">↓</span>
                  </div>
                  <div className="route-step dropoff">
                    <div className="route-marker">🏠</div>
                    <div className="route-content">
                      <span className="route-label">Delivery Location</span>
                      <span className="route-value">{activeTask.dropoff_location}</span>
                    </div>
                  </div>
                </div>

                <div className="delivery-value">
                  <span className="value-label">Order Value</span>
                  <span className="value-amount">₹{activeTask.order_value}</span>
                </div>

                <div className="delivery-actions">
                  {activeTask.status === 'ASSIGNED' && (
                    <button 
                      className="action-btn start"
                      onClick={() => handleStartDelivery(activeTask.request_id)}
                    >
                      <span>🚀</span> Start Delivery
                    </button>
                  )}
                  {activeTask.status === 'IN_PROGRESS' && (
                    <button 
                      className="action-btn complete"
                      onClick={() => handleCompleteDelivery(activeTask.request_id)}
                    >
                      <span>✅</span> Complete Delivery
                    </button>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <section className="section no-delivery-section">
              <div className="no-delivery-content">
                <div className="no-delivery-icon">🎉</div>
                <h2>No Active Deliveries</h2>
                <p>You&apos;re available for new tasks!</p>
                <div className="availability-indicator">
                  <span className="indicator-dot available"></span>
                  <span>Status: Available</span>
                </div>
              </div>
            </section>
          )}

          {/* Completed Deliveries */}
          {completedTasks.length > 0 && (
            <section className="section completed-section">
              <div className="section-header">
                <h2>✅ Completed Deliveries</h2>
                <span className="count-badge">{completedTasks.length} completed</span>
              </div>
              <div className="completed-list">
                {completedTasks.map(task => {
                  const clientStyle = clientConfig[task.client_name] || { bg: '#e9ecef', text: '#333', icon: '📦' };
                  return (
                    <div key={task.request_id} className="completed-card">
                      <div className="completed-top">
                        <span 
                          className="client-tag"
                          style={{ background: clientStyle.bg, color: clientStyle.text }}
                        >
                          {clientStyle.icon} {task.client_name}
                        </span>
                        <span className="completed-badge">✅ Completed</span>
                      </div>
                      <div className="completed-route">
                        {task.pickup_location} → {task.dropoff_location}
                      </div>
                      <div className="completed-value">₹{task.order_value}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="partner-footer">
          <p>Poolify - Delivery Partner Portal</p>
          <p className="hint">💡 Complete deliveries to become available for new tasks</p>
        </footer>
      </div>
    </div>
  );
}

export default DeliveryPartnerView;
