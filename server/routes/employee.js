const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.get('/', auth, roleCheck('hr', 'admin'), employeeController.getEmployees);

module.exports = router; 