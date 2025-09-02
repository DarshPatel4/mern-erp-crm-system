const express = require('express');
const router = express.Router();
const employeeDashboardController = require('../controllers/employeeDashboardController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Dashboard summary
router.get('/summary/:employeeId', employeeDashboardController.getDashboardSummary);

// Attendance data
router.get('/attendance/:employeeId', employeeDashboardController.getAttendanceData);

// Tasks
router.get('/tasks/:employeeId', employeeDashboardController.getTasks);

// Leave requests
router.get('/leaves/:employeeId', employeeDashboardController.getLeaveRequests);

// Payroll data
router.get('/payroll/:employeeId', employeeDashboardController.getPayrollData);

// Notifications
router.get('/notifications/:employeeId', employeeDashboardController.getNotifications);
router.put('/notifications/:notificationId/read', employeeDashboardController.markNotificationRead);

module.exports = router;
