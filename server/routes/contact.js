const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Contact form submission (public route, no auth required)
router.post('/submit', contactController.sendContactEmail);

// Test email endpoint (for debugging)
router.get('/test', contactController.testEmailConnection);

module.exports = router;
