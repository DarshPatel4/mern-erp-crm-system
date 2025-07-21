const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.get('/', auth, roleCheck('hr', 'admin'), employeeController.getEmployees);
router.post('/', auth, roleCheck('hr', 'admin'), employeeController.createEmployee);
router.get('/:id', auth, roleCheck('hr', 'admin'), employeeController.getEmployeeById);
router.put('/:id', auth, roleCheck('hr', 'admin'), employeeController.updateEmployee);
router.delete('/:id', auth, roleCheck('hr', 'admin'), employeeController.deleteEmployee);

module.exports = router; 