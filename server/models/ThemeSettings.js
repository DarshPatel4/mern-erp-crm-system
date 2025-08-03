const mongoose = require('mongoose');

const themeSettingsSchema = new mongoose.Schema({
  mode: { type: String, enum: ['light', 'dark'], default: 'light' },
  primaryColor: { type: String, default: '#6366f1' },
  secondaryColor: { type: String, default: '#f3f4f6' },
  accentColor: { type: String, default: '#8b5cf6' },
  fontSize: { type: Number, default: 14 },
  interfaceDensity: { type: String, enum: ['compact', 'comfortable', 'spacious'], default: 'comfortable' },
  fontFamily: { type: String, default: 'Inter' },
  borderRadius: { type: Number, default: 8 },
  shadows: { type: Boolean, default: true },
  animations: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ThemeSettings', themeSettingsSchema); 