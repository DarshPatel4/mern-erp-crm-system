const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const hrStatsController = require('../controllers/hrStatsController');

const router = express.Router();

router.get('/', auth, roleCheck('hr', 'admin'), hrStatsController.getHRStats);

module.exports = router; 