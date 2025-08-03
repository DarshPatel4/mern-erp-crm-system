const mongoose = require('mongoose');

const emailSmsConfigSchema = new mongoose.Schema({
  email: {
    smtpHost: { type: String },
    smtpPort: { type: Number },
    smtpUser: { type: String },
    smtpPassword: { type: String },
    fromEmail: { type: String },
    fromName: { type: String },
    templates: {
      welcome: { type: String },
      passwordReset: { type: String },
      leaveRequest: { type: String },
      invoice: { type: String }
    }
  },
  sms: {
    provider: { type: String },
    apiKey: { type: String },
    apiSecret: { type: String },
    fromNumber: { type: String },
    templates: {
      otp: { type: String },
      leaveApproval: { type: String },
      reminder: { type: String }
    }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('EmailSmsConfig', emailSmsConfigSchema); 