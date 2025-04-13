# Take Home Assignment

## Features

The application includes three main components accessible through tabs:

### 1. Reusable All-in-One Table
- Sortable columns with dynamic rendering
- Pagination support
- Search and filter functionality
- Responsive design

### 2. Process Flow Visualization
- Interactive node-edge diagram for visualizing process flows
- Drag-and-drop interface for arranging nodes
- Add, edit, and delete nodes and edges
- Three node types with different visual representations
- Auto-layout using dagre for hierarchical visualization

### 3. Data Analysis & Report Generation
- Upload JSON data or use sample data for analysis
- Customizable AI prompt for report generation
- Generate professional reports based on uploaded data
- View reports in printable format
- Save as PDF functionality

### 4. Analytics Dashboard
- Visual representation of process data
- Multiple chart types (Bar, Pie, Scatter, Radar)
- Interactive and responsive visualizations

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI**: Tailwind CSS 4, React Icons
- **Flow Visualization**: React Flow, Dagre (for auto-layout)
- **Charts**: Chart.js, React-Chartjs-2
- **Utilities**: UUID for unique identifiers

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/process-flow-viz.git
   cd process-flow-viz
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory based on the `.env.example` template:
   ```
   VITE_API_URL=your_api_endpoint
   ```
   Note: The API endpoint should point to a service that can handle the report generation requests.

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the application on [http://localhost:5173](http://localhost:5173) by default.

### Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
```

Preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Usage Guide

### Table Component
- The table component demonstrates a reusable data table with sorting and pagination
- Click on column headers to sort the data

### Process Flow
1. Add nodes using the "Add Node" button
2. Add edges to connect nodes using the "Add Edge" button
3. Edit or delete nodes and edges using the action buttons
4. Drag nodes to rearrange the layout
5. The flow automatically arranges in a hierarchical structure

### Report Generation
1. Upload a JSON file or load sample data
2. (Optional) Edit the AI prompt to customize the report generation
3. Click "Generate Report" to create a report based on the data
4. View the generated report in a new window, which can be printed or saved as PDF

## Future Improvements

- Custom hooks for state management
- Context providers for shared state
- Better error handling and validation
- Optimized report generation
- More user-friendly loading states
- Consistent theming throughout the application
- Data persistence between sessions

## License

[MIT License](LICENSE)
