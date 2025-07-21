const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, enum: ['In Process', 'Hired', 'Rejected'], default: 'In Process' },
  appliedDate: { type: Date, required: true },
  onboardingStatus: { type: String },
});

module.exports = mongoose.model('Candidate', candidateSchema); 