# Poolify - Intelligent Delivery Assignment System

A Proof-of-Concept (PoC) full-stack React application that intelligently assigns delivery tasks to available delivery personnel based on simplified location matching (Society names).

## 🚀 Features

- **Smart Assignment Logic**: Automatically assigns delivery boys based on location proximity
- **Priority-Based Matching**:
  - Priority 1: Delivery boy at dropoff location (OPTIMAL - maximum fuel saving)
  - Priority 2: Delivery boy at pickup location (closest to start point)
- **Real-time UI Updates**: Instant visual feedback when assignments are made
- **Admin Dashboard**: Single-page dashboard to manage all tasks and delivery personnel

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
│   │   ├── PoolifyDashboard.jsx    # Main dashboard component
│   │   └── PoolifyDashboard.css    # Dashboard styles
│   ├── App.jsx                      # Root component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html
├── package.json
└── README.md
```

## 🎯 How It Works

### Mock Data

The application uses in-memory mock data for:
- **Delivery Boys**: Each has an ID, name, current location (society), and availability status
- **Tasks**: Each has a request ID, client name, pickup/dropoff locations, and status

### Assignment Algorithm

When you click "Run Assignment" on a pending task:

1. **Filter**: Only available delivery boys are considered
2. **Priority 1 (Optimal)**: Find a delivery boy already at the dropoff location
3. **Priority 2 (Good)**: If no Priority 1 match, find one at the pickup location
4. **Assignment**: Update task status to "ASSIGNED" and delivery boy to "Busy"

### Console Logging

Open your browser's developer console (F12) to see detailed assignment logic:
- Which delivery boys are available
- Which priority match was found
- Final assignment details

## 🎨 UI Components

### Pending Tasks Panel
- Lists all tasks with status "PENDING"
- Shows request ID, client name, pickup and dropoff locations
- "Run Assignment" button for each task

### Delivery Boy Status Panel
- Shows all delivery personnel
- Color-coded availability (green = Available, red = Busy)
- Displays current location and assigned task (if any)

## 🔧 Built With

- [React](https://react.dev/) - Frontend library
- [Vite](https://vitejs.dev/) - Build tool
- CSS3 - Styling

## 📝 Notes

- This is a PoC application - all data is stored in memory
- No backend server or external APIs are used
- Refreshing the page resets all data to initial state

## 📄 License

This project is open source and available under the MIT License.
