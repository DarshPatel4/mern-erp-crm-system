const mongoose = require('mongoose');

const notificationPreferencesSchema = new mongoose.Schema({
  email: {
    enabled: { type: Boolean, default: true },
    types: {
      newLead: { type: Boolean, default: true },
      leaveRequest: { type: Boolean, default: true },
      taskAssignment: { type: Boolean, default: true },
      invoiceGenerated: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true }
    },
    frequency: { type: String, enum: ['immediate', 'daily', 'weekly'], default: 'immediate' },
    quietHours: {
      enabled: { type: Boolean, default: false },
      startTime: { type: String, default: '22:00' },
      endTime: { type: String, default: '08:00' }
    }
  },
  sms: {
    enabled: { type: Boolean, default: false },
    types: {
      urgentAlerts: { type: Boolean, default: true },
      otpVerification: { type: Boolean, default: true },
      leaveApproval: { type: Boolean, default: false }
    }
  },
  push: {
    enabled: { type: Boolean, default: true },
    types: {
      newLead: { type: Boolean, default: true },
      leaveRequest: { type: Boolean, default: true },
      taskAssignment: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true }
    }
  },
  inApp: {
    enabled: { type: Boolean, default: true },
    types: {
      allNotifications: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      updates: { type: Boolean, default: true }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('NotificationPreferences', notificationPreferencesSchema); 