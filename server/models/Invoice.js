const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  client: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoiceSchema); 