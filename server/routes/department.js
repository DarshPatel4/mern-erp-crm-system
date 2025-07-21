const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

router.get('/', auth, roleCheck('hr', 'admin'), departmentController.getDepartments);

module.exports = router; 