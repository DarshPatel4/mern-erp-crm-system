const mongoose = require('mongoose');

const documentBrandingSchema = new mongoose.Schema({
  logos: {
    primary: { type: String },
    secondary: { type: String },
    favicon: { type: String }
  },
  header: {
    showLogo: { type: Boolean, default: true },
    showCompanyName: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: true },
    showSocialLinks: { type: Boolean, default: false }
  },
  footer: {
    showLogo: { type: Boolean, default: true },
    showCompanyName: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: true },
    showSocialLinks: { type: Boolean, default: false }
  },
  documentSettings: {
    pageSize: { type: String, enum: ['A4', 'Letter', 'Legal'], default: 'A4' },
    orientation: { type: String, enum: ['portrait', 'landscape'], default: 'portrait' },
    margins: { type: Number, default: 20 },
    fontFamily: { type: String, default: 'Arial' },
    fontSize: { type: Number, default: 12 },
    primaryColor: { type: String, default: '#6366f1' },
    secondaryColor: { type: String, default: '#f3f4f6' }
  }
}, { timestamps: true });

module.exports = mongoose.model('DocumentBranding', documentBrandingSchema); 