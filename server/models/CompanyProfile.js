const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
  industry: { type: String },
  foundedYear: { type: Number },
  employeeCount: { type: Number },
  description: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  contact: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
  },
  socialMedia: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema); 