const EmployeePayroll = require('../models/EmployeePayroll');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// Get employee's payroll data
exports.getPayrollData = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    let query = { employeeId: new mongoose.Types.ObjectId(employeeId) };
    
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const payrollData = await EmployeePayroll.find(query)
      .sort({ year: -1, month: -1 });

    res.json(payrollData);
  } catch (error) {
    console.error('Error fetching payroll data:', error);
    res.status(500).json({ error: 'Failed to fetch payroll data' });
  }
};

// Get payslip by ID
exports.getPayslipById = async (req, res) => {
  try {
    const { employeeId, payslipId } = req.params;

    const payslip = await EmployeePayroll.findOne({
      _id: payslipId,
      employeeId: new mongoose.Types.ObjectId(employeeId)
    });

    if (!payslip) {
      return res.status(404).json({ error: 'Payslip not found' });
    }

    res.json(payslip);
  } catch (error) {
    console.error('Error fetching payslip:', error);
    res.status(500).json({ error: 'Failed to fetch payslip' });
  }
};

// Get payroll summary for current year
exports.getPayrollSummary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentYear = new Date().getFullYear();

    const payrollData = await EmployeePayroll.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      year: currentYear
    }).sort({ month: 1 });

    // Calculate yearly totals
    const yearlyTotals = payrollData.reduce((acc, payroll) => {
      acc.grossSalary += payroll.grossSalary || 0;
      acc.netSalary += payroll.netSalary || 0;
      acc.totalDeductions += payroll.totalDeductions || 0;
      acc.performanceBonus += payroll.performanceBonus || 0;
      return acc;
    }, {
      grossSalary: 0,
      netSalary: 0,
      totalDeductions: 0,
      performanceBonus: 0
    });

    // Calculate monthly averages
    const monthlyAverages = {
      grossSalary: payrollData.length > 0 ? yearlyTotals.grossSalary / payrollData.length : 0,
      netSalary: payrollData.length > 0 ? yearlyTotals.netSalary / payrollData.length : 0,
      totalDeductions: payrollData.length > 0 ? yearlyTotals.totalDeductions / payrollData.length : 0
    };

    res.json({
      yearlyTotals,
      monthlyAverages,
      totalMonths: payrollData.length,
      year: currentYear,
      monthlyData: payrollData.map(payroll => ({
        month: payroll.month,
        monthName: payroll.monthName,
        grossSalary: payroll.grossSalary,
        netSalary: payroll.netSalary,
        totalDeductions: payroll.totalDeductions
      }))
    });
  } catch (error) {
    console.error('Error fetching payroll summary:', error);
    res.status(500).json({ error: 'Failed to fetch payroll summary' });
  }
};

// Download payslip (placeholder for file generation)
exports.downloadPayslip = async (req, res) => {
  try {
    const { employeeId, payslipId } = req.params;

    const payslip = await EmployeePayroll.findOne({
      _id: payslipId,
      employeeId: new mongoose.Types.ObjectId(employeeId)
    });

    if (!payslip) {
      return res.status(404).json({ error: 'Payslip not found' });
    }

    // TODO: Generate PDF payslip
    // For now, return the payslip data
    res.json({
      message: 'Payslip download initiated',
      payslip: {
        id: payslip._id,
        month: payslip.month,
        year: payslip.year,
        netSalary: payslip.netSalary,
        downloadUrl: `/api/payroll/download/${payslip._id}/pdf`
      }
    });
  } catch (error) {
    console.error('Error downloading payslip:', error);
    res.status(500).json({ error: 'Failed to download payslip' });
  }
};

// Get tax information
exports.getTaxInfo = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year } = req.query;

    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const payrollData = await EmployeePayroll.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      year: targetYear
    });

    // Calculate tax summary
    const taxSummary = payrollData.reduce((acc, payroll) => {
      acc.totalIncome += payroll.grossSalary || 0;
      acc.totalTax += payroll.incomeTax || 0;
      acc.totalSocialSecurity += payroll.socialSecurity || 0;
      acc.totalHealthInsurance += payroll.healthInsurance || 0;
      return acc;
    }, {
      totalIncome: 0,
      totalTax: 0,
      totalSocialSecurity: 0,
      totalHealthInsurance: 0
    });

    // Calculate effective tax rate
    const effectiveTaxRate = taxSummary.totalIncome > 0 ? 
      (taxSummary.totalTax / taxSummary.totalIncome) * 100 : 0;

    res.json({
      year: targetYear,
      taxSummary,
      effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
      monthlyBreakdown: payrollData.map(payroll => ({
        month: payroll.month,
        monthName: payroll.monthName,
        grossSalary: payroll.grossSalary,
        incomeTax: payroll.incomeTax,
        socialSecurity: payroll.socialSecurity,
        healthInsurance: payroll.healthInsurance
      }))
    });
  } catch (error) {
    console.error('Error fetching tax information:', error);
    res.status(500).json({ error: 'Failed to fetch tax information' });
  }
};
