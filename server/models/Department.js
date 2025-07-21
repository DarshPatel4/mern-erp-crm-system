const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String },
  employeeCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Department', departmentSchema); 