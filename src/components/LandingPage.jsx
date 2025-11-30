import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const { deliveryBoys, resetData } = useData();
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');
  const [notification, setNotification] = useState(null);

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleDeliveryBoySelect = (e) => {
    setSelectedDeliveryBoy(e.target.value);
  };

  const handleDeliveryLogin = () => {
    if (selectedDeliveryBoy) {
      navigate(`/partner/${selectedDeliveryBoy}`);
    }
  };

  const handleReset = () => {
    const result = resetData();
    setNotification(result);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="landing-page">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.success ? 'success' : 'error'}`}>
          {notification.success ? '✅' : '❌'} {notification.message}
        </div>
      )}

      <div className="landing-container">
        {/* Header/Branding */}
        <header className="landing-header">
          <div className="logo">
            <span className="logo-icon">🚚</span>
            <h1>Poolify</h1>
          </div>
          <p className="tagline">Smart Delivery Assignment Platform</p>
        </header>

        {/* Role Selection Cards */}
        <div className="role-selection">
          <h2>Choose Your Role</h2>
          
          <div className="role-cards">
            {/* Admin Card */}
            <div className="role-card admin-card" onClick={handleAdminClick}>
              <div className="card-icon">🛠️</div>
              <h3>Admin Dashboard</h3>
              <p>Manage delivery assignments, view all tasks and delivery personnel status in real-time</p>
              <button className="role-btn admin-btn">
                <span>📊</span> Enter Admin Dashboard
              </button>
            </div>

            {/* Delivery Partner Card */}
            <div className="role-card partner-card">
              <div className="card-icon">🏍️</div>
              <h3>Delivery Partner</h3>
              <p>View your assigned tasks, start deliveries, and update delivery status</p>
              
              <div className="delivery-select-container">
                <div className="select-wrapper">
                  <span className="select-icon">👤</span>
                  <select 
                    value={selectedDeliveryBoy} 
                    onChange={handleDeliveryBoySelect}
                    className="delivery-select"
                  >
                    <option value="">Choose your profile...</option>
                    {deliveryBoys.map(db => (
                      <option key={db.db_id} value={db.db_id}>
                        {db.name} • {db.current_location}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  className="role-btn login-btn"
                  onClick={handleDeliveryLogin}
                  disabled={!selectedDeliveryBoy}
                >
                  <span>🚀</span> Continue as Partner
                </button>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="reset-section">
            <button className="reset-btn" onClick={handleReset}>
              <span>🔄</span> Reset LocalStorage
            </button>
            <p className="reset-hint">Restore all data to initial state</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="landing-footer">
          <p>💡 Data persists across page refreshes using LocalStorage</p>
          <p className="version">Poolify v2.0 - Warehouse-Based Delivery System</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
