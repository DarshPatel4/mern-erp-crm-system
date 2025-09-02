const express = require('express');
const router = express.Router();
const employeeAttendanceController = require('../controllers/employeeAttendanceController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Check-in employee
router.post('/check-in/:employeeId', employeeAttendanceController.checkIn);

// Check-out employee
router.post('/check-out/:employeeId', employeeAttendanceController.checkOut);

// Start break
router.post('/start-break/:employeeId', employeeAttendanceController.startBreak);

// End break
router.post('/end-break/:employeeId', employeeAttendanceController.endBreak);

// Get today's attendance status
router.get('/today-status/:employeeId', employeeAttendanceController.getTodayStatus);

// Get monthly attendance summary
router.get('/monthly-summary/:employeeId', employeeAttendanceController.getMonthlySummary);

module.exports = router;
