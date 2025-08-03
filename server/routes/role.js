const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Get all roles
router.get('/', auth, roleCheck(['admin']), roleController.getRoles);

// Create new role
router.post('/', auth, roleCheck(['admin']), roleController.createRole);

// Update role
router.put('/:id', auth, roleCheck(['admin']), roleController.updateRole);

// Delete role
router.delete('/:id', auth, roleCheck(['admin']), roleController.deleteRole);

// Get role by ID
router.get('/:id', auth, roleCheck(['admin']), roleController.getRoleById);

// Update role user count
router.post('/update-counts', auth, roleCheck(['admin']), roleController.updateRoleUserCount);

module.exports = router; 