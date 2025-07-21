const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const leaveController = require('../controllers/leaveController');

const router = express.Router();

router.get('/', auth, roleCheck('hr', 'admin'), leaveController.getLeaves);

module.exports = router; 