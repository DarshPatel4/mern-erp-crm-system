const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  employeeCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Designation', designationSchema); 