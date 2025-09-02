const express = require('express');
const router = express.Router();
const employeeProfileController = require('../controllers/employeeProfileController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get employee profile
router.get('/:employeeId', employeeProfileController.getProfile);

// Update employee profile
router.put('/:employeeId', employeeProfileController.updateProfile);

// Update profile picture
router.put('/:employeeId/picture', employeeProfileController.updateProfilePicture);

// Request profile update (for HR approval)
router.post('/:employeeId/request-update', employeeProfileController.requestProfileUpdate);

// Get profile update history
router.get('/:employeeId/update-history', employeeProfileController.getProfileUpdateHistory);

module.exports = router;
