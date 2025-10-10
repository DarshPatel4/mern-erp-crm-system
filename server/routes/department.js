const express = require('express');
const { auth } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

router.get('/', auth, roleCheck(['hr', 'admin']), departmentController.getDepartments);
router.post('/', auth, roleCheck(['hr', 'admin']), departmentController.createDepartment);
router.put('/:id', auth, roleCheck(['hr', 'admin']), departmentController.updateDepartment);
router.delete('/:id', auth, roleCheck(['hr', 'admin']), departmentController.deleteDepartment);

module.exports = router; 