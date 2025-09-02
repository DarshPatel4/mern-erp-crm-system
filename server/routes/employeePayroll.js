const express = require('express');
const router = express.Router();
const employeePayrollController = require('../controllers/employeePayrollController');
const { auth } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get employee's payroll data
router.get('/data/:employeeId', employeePayrollController.getPayrollData);

// Get payslip by ID
router.get('/payslip/:employeeId/:payslipId', employeePayrollController.getPayslipById);

// Get payroll summary for current year
router.get('/summary/:employeeId', employeePayrollController.getPayrollSummary);

// Download payslip
router.get('/download/:employeeId/:payslipId', employeePayrollController.downloadPayslip);

// Get tax information
router.get('/tax-info/:employeeId', employeePayrollController.getTaxInfo);

module.exports = router;
