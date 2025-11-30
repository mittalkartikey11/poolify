# Poolify - Smart Delivery Assignment Platform

A full-stack React application that intelligently assigns delivery tasks to available delivery personnel using a warehouse-based delivery system with LocalStorage persistence.

## 🚀 Features

### Core Features
- **LocalStorage Backend**: All data persists across sessions using browser localStorage
- **Real-time Cross-tab Sync**: Changes in Admin view automatically reflect in Partner view
- **Warehouse-Based Routing**: Delivery boys stationed at client warehouses
- **Smart Assignment Logic**: Priority-based matching for optimal assignments
- **Reset Functionality**: One-click reset to restore initial mock data

### Assignment Priority System
- **Priority 1**: Match delivery boy's location with task pickup warehouse (optimal fuel efficiency)
- **Priority 2**: Assign any available delivery boy

### User Interfaces
- **Landing Page**: Role selection with improved profile dropdown and reset button
- **Admin Dashboard**: Full overview with stats cards, pending tasks, and personnel status
- **Delivery Partner View**: Profile selection, active deliveries, and task management

## 📋 Requirements

- Node.js (v16 or higher)
- npm (v7 or higher)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/mittalkartikey11/poolify.git
cd poolify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
poolify/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx           # Role selection with reset button
│   │   ├── LandingPage.css           # Landing page styles
│   │   ├── PoolifyDashboard.jsx      # Admin dashboard with stats
│   │   ├── PoolifyDashboard.css      # Dashboard styles
│   │   ├── DeliveryPartnerView.jsx   # Partner view with profile select
│   │   └── DeliveryPartnerView.css   # Partner view styles
│   ├── context/
│   │   └── DataContext.jsx           # React context with localStorage
│   ├── hooks/
│   │   └── useData.js                # Custom hook for data access
│   ├── services/
│   │   └── localStorageService.js    # LocalStorage operations
│   ├── App.jsx                       # Root component with routing
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles with DM Sans font
├── index.html                        # HTML with Google Fonts
├── package.json
└── README.md
```

## 🗺️ Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Role selection with reset functionality |
| `/admin` | PoolifyDashboard | Admin dashboard with stats and management |
| `/partner` | DeliveryPartnerView | Partner profile selection |
| `/partner/:db_id` | DeliveryPartnerView | Individual delivery partner view |

## 🗄️ Data Structure

### Delivery Boys (at Warehouses)
```javascript
{
  db_id: 1,
  name: "Rahul Kumar",
  current_location: "Blinkit Center",  // Warehouse location
  is_available: true,
  assigned_request_id: null,
  avatar: "https://ui-avatars.com/api/?name=Rahul+Kumar&background=3b82f6&color=fff"
}
```

### Tasks (Warehouse → Society)
```javascript
{
  request_id: "REQ001",
  client_name: "Blinkit",
  pickup_location: "Blinkit Center",   // Warehouse
  dropoff_location: "Sunrise Heights", // Customer society
  status: "PENDING",
  assigned_to: null,
  customer_name: "Rohit Sharma",
  order_value: 450
}
```

## 🎯 How It Works

### Task Assignment Flow
1. Admin clicks "Run Assignment" on a pending task
2. System finds best delivery boy (Priority 1: at pickup warehouse, Priority 2: any available)
3. Task status changes to "ASSIGNED", delivery boy becomes "BUSY"
4. Changes persist to localStorage and sync across tabs

### Delivery Workflow
1. **Admin assigns task** → Status: ASSIGNED
2. **Partner starts delivery** → Status: IN_PROGRESS
3. **Partner completes delivery** → Status: COMPLETED, Partner available at new location

### Real-time Sync
- Uses browser `storage` events for cross-tab synchronization
- Open admin and partner views in different tabs
- Changes in one tab automatically reflect in the other

## 🎨 Design System

- **Font**: DM Sans (Google Fonts)
- **Primary Blue**: #3b82f6
- **Success Green**: #10b981
- **Warning Orange**: #f59e0b
- **Background**: #f9fafb
- **Cards**: #ffffff

## 🔧 Built With

- [React 19](https://react.dev/) - Frontend library
- [React Router 7](https://reactrouter.com/) - Client-side routing
- [Vite 7](https://vitejs.dev/) - Build tool
- LocalStorage - Data persistence
- DM Sans - Typography

## 📝 LocalStorage Keys

```javascript
poolify_delivery_boys  // Delivery personnel data
poolify_tasks          // Task/order data
poolify_initialized    // Initialization flag
```

## ✅ Success Criteria Met

- ✅ Data persists across page refreshes
- ✅ Admin can assign tasks, visible in partner view
- ✅ Partner can update status, visible in admin view
- ✅ Reset button restores initial state
- ✅ UI matches design inspiration
- ✅ Warehouse-based routing works correctly
- ✅ DM Sans font throughout
- ✅ Avatars display for each delivery boy
- ✅ Stats cards show real-time counts
- ✅ No console errors
- ✅ Clean, production-ready code

## 📄 License

This project is open source and available under the MIT License.
