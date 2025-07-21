const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const designationController = require('../controllers/designationController');

const router = express.Router();

router.get('/', auth, roleCheck('hr', 'admin'), designationController.getDesignations);

module.exports = router; 