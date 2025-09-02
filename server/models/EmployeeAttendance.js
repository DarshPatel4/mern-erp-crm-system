const mongoose = require('mongoose');

const employeeAttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  workingHours: {
    type: Number, // in minutes
    default: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave', 'half-day'],
    default: 'present'
  },
  breakStartTime: {
    type: Date
  },
  breakEndTime: {
    type: Date
  },
  totalBreakTime: {
    type: Number, // in minutes
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
employeeAttendanceSchema.index({ employeeId: 1, date: 1 });

module.exports = mongoose.model('EmployeeAttendance', employeeAttendanceSchema);
