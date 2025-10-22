const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const dashboardRoutes = require('./routes/dashboard');
const employeeRoutes = require('./routes/employee');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
const candidateRoutes = require('./routes/candidate');
const departmentRoutes = require('./routes/department');
const designationRoutes = require('./routes/designation');
const hrStatsRoutes = require('./routes/hrStats');
const roleRoutes = require('./routes/role');
const settingsRoutes = require('./routes/settings');
const leadRoutes = require('./routes/lead');
const invoiceRoutes = require('./routes/invoice');
const employeeDashboardRoutes = require('./routes/employeeDashboard');
const employeeAttendanceRoutes = require('./routes/employeeAttendance');
const employeeLeaveRoutes = require('./routes/employeeLeave');
const employeePayrollRoutes = require('./routes/employeePayroll');
const employeeProfileRoutes = require('./routes/employeeProfile');
const taskRoutes = require('./routes/task');
const analyticsRoutes = require('./routes/analytics');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/designations', designationRoutes);
app.use('/api/hr-stats', hrStatsRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/employee-dashboard', employeeDashboardRoutes);
app.use('/api/employee-attendance', employeeAttendanceRoutes);
app.use('/api/employee-leave', employeeLeaveRoutes);
app.use('/api/employee-payroll', employeePayrollRoutes);
app.use('/api/employee-profile', employeeProfileRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  // Initialize analytics data asynchronously without blocking server start
  const initAnalyticsData = require('./initAnalyticsData');
  initAnalyticsData().catch(err => console.error('Analytics initialization error:', err));
})
.catch((err) => console.error('MongoDB connection error:', err));

// Default route for testing
app.get("/", (req, res) => {
  res.send("Backend is running 🚀. Use /api/... endpoints.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 