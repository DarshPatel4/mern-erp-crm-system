const express = require('express');
const router = express.Router();
const employeeLeaveController = require('../controllers/employeeLeaveController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Apply for leave
router.post('/apply/:employeeId', employeeLeaveController.applyLeave);

// Get employee's leave requests
router.get('/requests/:employeeId', employeeLeaveController.getLeaveRequests);

// Get leave balance
router.get('/balance/:employeeId', employeeLeaveController.getLeaveBalance);

// Cancel leave request
router.put('/cancel/:employeeId/:leaveId', employeeLeaveController.cancelLeaveRequest);

// Get leave request by ID
router.get('/request/:employeeId/:leaveId', employeeLeaveController.getLeaveRequestById);

module.exports = router;
