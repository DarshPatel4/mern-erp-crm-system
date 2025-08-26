const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Get all leads with pagination, sorting, and filtering
router.get('/', auth, roleCheck(['admin', 'sales', 'hr']), leadController.getLeads);

// Get lead statistics
router.get('/stats', auth, roleCheck(['admin', 'sales', 'hr']), leadController.getLeadStats);

// Get employees for assignment dropdown
router.get('/employees', auth, roleCheck(['admin', 'sales', 'hr']), leadController.getEmployeesForAssignment);

// Export leads to CSV
router.get('/export', auth, roleCheck(['admin', 'sales', 'hr']), leadController.exportLeads);

// Get lead by ID
router.get('/:id', auth, roleCheck(['admin', 'sales', 'hr']), leadController.getLeadById);

// Create new lead
router.post('/', auth, roleCheck(['admin', 'sales']), leadController.createLead);

// Update lead
router.put('/:id', auth, roleCheck(['admin', 'sales']), leadController.updateLead);

// Delete lead (soft delete)
router.delete('/:id', auth, roleCheck(['admin']), leadController.deleteLead);

module.exports = router; 