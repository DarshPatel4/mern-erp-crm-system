const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/summary', auth, roleCheck('admin'), dashboardController.getDashboardSummary);

module.exports = router; 