const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Lost'],
    default: 'New',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', leadSchema); 