const mongoose = require('mongoose');

// Line item subdocument schema
const invoiceItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
    clientName: { type: String, required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    items: { type: [invoiceItemSchema], default: [] },
    amount: { type: Number, required: true },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Overdue', 'Draft'], default: 'Unpaid' },
    notes: { type: String },
    currency: { type: String, enum: ['USD', 'INR', 'EUR', 'GBP'], default: 'USD' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);