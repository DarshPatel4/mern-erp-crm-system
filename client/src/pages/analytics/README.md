# Analytics Dashboard

## Overview
The Analytics Dashboard provides comprehensive insights into your ERP-CRM system's performance with real-time data visualization and interactive charts.

## Features

### 📊 Summary Cards
- **Total Clients** - Shows client count with percentage change from last month
- **Total Employees** - Displays employee count with growth metrics
- **Active Leads** - Current lead count with conversion tracking
- **Open Tasks** - Task status overview with completion rates
- **Pending Invoices** - Invoice status with overdue percentage

### 📈 Interactive Charts
1. **Revenue Trend** - Monthly revenue visualization for the past 12 months
2. **Lead Conversion Funnel** - Visual representation of lead progression
3. **Employee Performance** - Department-wise task completion rates
4. **Task Status Overview** - Distribution of tasks by status
5. **Lead Distribution** - Regional breakdown of leads
6. **Top Clients** - Revenue-based client ranking
7. **Top Performers** - Employee performance metrics

### 🔧 Functionality
- **Filter Options**: Last 30 Days, Last 90 Days, This Year
- **Export Features**: PDF and CSV export capabilities
- **Live Data**: Auto-refresh every 30 seconds
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## Technical Implementation

### Frontend Components
- `AnalyticsDashboard.jsx` - Main dashboard container
- `AnalyticsContent.jsx` - Core analytics content with filtering
- `SummaryCards.jsx` - KPI summary cards
- `RevenueChart.jsx` - Revenue trend visualization
- `LeadConversionFunnel.jsx` - Lead conversion metrics
- `EmployeePerformanceChart.jsx` - Employee performance data
- `TaskStatusChart.jsx` - Task status distribution
- `LeadDistributionChart.jsx` - Regional lead analysis
- `TopClients.jsx` - Top revenue clients
- `TopPerformers.jsx` - Employee performance ranking

### Backend API
- **GET /api/analytics** - Fetch analytics data with filtering
- **GET /api/analytics/export** - Export analytics data (PDF/CSV)

### Data Sources
- **Leads Collection** - Lead conversion and distribution data
- **Employees Collection** - Employee performance metrics
- **Tasks Collection** - Task status and completion data
- **Invoices Collection** - Revenue and client data
- **EmployeeTasks Collection** - Employee task assignments

## Usage

### Accessing Analytics
1. Navigate to the Analytics section from the sidebar
2. The dashboard will load with real-time data
3. Use filter dropdown to change time periods
4. Toggle live data refresh as needed
5. Export reports in PDF or CSV format

### Data Refresh
- Automatic refresh every 30 seconds when live data is enabled
- Manual refresh by changing filters
- Real-time updates when underlying data changes

## Performance Features
- **Caching** - Heavy analytics queries are cached for better performance
- **Aggregation** - MongoDB aggregation pipelines for efficient data processing
- **Real-time Updates** - Live data synchronization with database changes
- **Responsive Charts** - Optimized chart rendering for different screen sizes

## Security
- Role-based access control (Admin, HR, Sales roles)
- Authentication required for all analytics endpoints
- Data filtering based on user permissions

## Dependencies
- **Frontend**: React, Chart.js, React-ChartJS-2, React Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Charts**: Chart.js with custom styling
- **Export**: CSV generation, PDF support (planned)

## Future Enhancements
- Advanced filtering options
- Custom date range selection
- Email scheduling for reports
- Interactive drill-down capabilities
- Real-time notifications for key metrics
- Mobile app integration
