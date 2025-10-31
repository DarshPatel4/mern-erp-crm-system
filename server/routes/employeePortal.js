const express = require('express');
const employeeDashboardController = require('../controllers/employeeDashboardController');
const employeeAttendanceController = require('../controllers/employeeAttendanceController');
const employeeLeaveController = require('../controllers/employeeLeaveController');
const employeePayrollController = require('../controllers/employeePayrollController');
const employeeProfileController = require('../controllers/employeeProfileController');
const { auth, ensureEmployeeAccess } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// Dashboard summary
router.get(
  '/employee/:employeeId/dashboard-summary',
  ensureEmployeeAccess('employeeId'),
  employeeDashboardController.getDashboardSummary
);

// Employee profile
router.get(
  '/employee/:employeeId',
  ensureEmployeeAccess('employeeId'),
  employeeProfileController.getProfile
);

router.put(
  '/employee/update/:employeeId',
  ensureEmployeeAccess('employeeId'),
  employeeProfileController.updateProfile
);

router.put(
  '/employee/:employeeId/profile-picture',
  ensureEmployeeAccess('employeeId'),
  employeeProfileController.updateProfilePicture
);

// Attendance
router.get(
  '/attendance/:employeeId',
  ensureEmployeeAccess('employeeId'),
  employeeDashboardController.getAttendanceData
);

router.post('/attendance/mark', employeeAttendanceController.markAttendance);

// Tasks
router.get(
  '/tasks/:employeeId',
  ensureEmployeeAccess('employeeId'),
  employeeDashboardController.getTasks
);

router.put('/tasks/update/:taskId', employeeDashboardController.updateTaskStatus);

// Leaves
router.get(
  '/leaves/:employeeId',
  ensureEmployeeAccess('employeeId'),
  employeeLeaveController.getLeaveRequests
);

router.post('/leaves/apply', employeeLeaveController.applyLeave);

// Payroll
router.get(
  '/payroll/:employeeId',
  ensureEmployeeAccess('employeeId'),
  employeePayrollController.getPayrollData
);

// Notifications
router.get(
  '/employee/:employeeId/notifications',
  ensureEmployeeAccess('employeeId'),
  employeeDashboardController.getNotifications
);

router.put(
  '/employee/:employeeId/notifications/:notificationId/read',
  ensureEmployeeAccess('employeeId'),
  employeeDashboardController.markNotificationRead
);

module.exports = router;

