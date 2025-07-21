const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  approver: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  days: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Leave', leaveSchema); 