const mongoose = require('mongoose');

const employeeLeaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leaveType: {
    type: String,
    enum: ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave', 'Bereavement Leave'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    enum: ['Full Day', 'Half Day (Morning)', 'Half Day (Afternoon)', 'Multiple Days'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  supportingDocuments: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalDays: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
employeeLeaveSchema.index({ employeeId: 1, status: 1, startDate: 1 });

module.exports = mongoose.model('EmployeeLeave', employeeLeaveSchema);
