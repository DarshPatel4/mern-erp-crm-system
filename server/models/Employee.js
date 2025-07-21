const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  hireDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'On Leave', 'Remote', 'Inactive'], default: 'Active' },
});

module.exports = mongoose.model('Employee', employeeSchema); 