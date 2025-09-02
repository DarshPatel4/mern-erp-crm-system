const mongoose = require('mongoose');

const employeePayrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  houseAllowance: {
    type: Number,
    default: 0
  },
  transportAllowance: {
    type: Number,
    default: 0
  },
  performanceBonus: {
    type: Number,
    default: 0
  },
  otherAllowances: {
    type: Number,
    default: 0
  },
  grossSalary: {
    type: Number,
    required: true
  },
  incomeTax: {
    type: Number,
    default: 0
  },
  socialSecurity: {
    type: Number,
    default: 0
  },
  healthInsurance: {
    type: Number,
    default: 0
  },
  otherDeductions: {
    type: Number,
    default: 0
  },
  totalDeductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true
  },
  payslipGenerated: {
    type: Boolean,
    default: false
  },
  payslipPath: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
employeePayrollSchema.index({ employeeId: 1, month: 1, year: 1 });

// Virtual for month name
employeePayrollSchema.virtual('monthName').get(function() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[this.month - 1];
});

// Ensure virtual fields are serialized
employeePayrollSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('EmployeePayroll', employeePayrollSchema);
