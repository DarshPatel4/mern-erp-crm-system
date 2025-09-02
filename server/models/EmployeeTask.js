const mongoose = require('mongoose');

const employeeTaskSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'urgent'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  completedAt: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
employeeTaskSchema.index({ employeeId: 1, status: 1, dueDate: 1 });

module.exports = mongoose.model('EmployeeTask', employeeTaskSchema);
