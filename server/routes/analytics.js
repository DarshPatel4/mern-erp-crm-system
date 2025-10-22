const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth } = require('../middleware/auth');

// Get analytics data
router.get('/', auth, analyticsController.getAnalyticsData);

// Export analytics data
router.get('/export', auth, analyticsController.exportAnalytics);

module.exports = router;
