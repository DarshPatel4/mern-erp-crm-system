const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const candidateController = require('../controllers/candidateController');

const router = express.Router();

router.get('/', auth, roleCheck('hr', 'admin'), candidateController.getCandidates);

module.exports = router; 