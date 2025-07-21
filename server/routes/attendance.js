const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.get('/', auth, roleCheck('hr', 'admin'), attendanceController.getAttendance);

module.exports = router; 