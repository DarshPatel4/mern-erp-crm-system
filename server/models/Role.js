const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: '#6366f1' },
  permissions: {
    dashboard: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'View Only' },
    leads: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'No Access' },
    clients: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'No Access' },
    tasks: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'View Only' },
    invoices: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'No Access' },
    analytics: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'No Access' },
    settings: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'No Access' },
    employees: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'View Only' },
    attendance: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'View Only' },
    leaveTracker: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'View Only' },
    recruitment: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'No Access' },
    departments: { type: String, enum: ['Full Access', 'View Only', 'Limited Access', 'No Access'], default: 'No Access' }
  },
  isActive: { type: Boolean, default: true },
  userCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema); 