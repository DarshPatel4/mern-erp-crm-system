/*
  Temporary script to insert sample invoices into MongoDB.
  Usage:
    1) Ensure .env has MONGO_URI set
    2) From project root: node server/seedInvoices.js
*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Invoice = require('./models/Invoice');

dotenv.config();

function computeItemTotal(item) {
  const quantity = Number(item.quantity || 0);
  const price = Number(item.price || 0);
  const discount = Number(item.discount || 0);
  const tax = Number(item.tax || 0);
  const subtotal = quantity * price;
  return Math.max(0, subtotal - discount + tax);
}

function computeInvoiceAmount(items) {
  return items.reduce((sum, it) => sum + computeItemTotal(it), 0);
}

function formatInvoiceNumber(seq) {
  return `INV-2023-${String(seq).padStart(3, '0')}`;
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI is not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  try {
    // Determine next invoice number sequence based on latest record
    const last = await Invoice.findOne({}).sort({ createdAt: -1 });
    let nextSeq = 1;
    if (last?.invoiceNumber) {
      const parts = last.invoiceNumber.split('-');
      const seq = parseInt(parts[2], 10);
      if (!Number.isNaN(seq)) nextSeq = seq + 1;
    }

    const now = new Date();
    const in7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 12);
    const lastMonthDue = new Date(now.getFullYear(), now.getMonth() - 1, 28);

    const samples = [
      {
        invoiceNumber: formatInvoiceNumber(nextSeq++),
        clientName: 'Acme Inc.',
        issueDate: lastMonth,
        dueDate: lastMonthDue,
        status: 'Paid',
        items: [
          { itemName: 'Consulting Hours', description: 'Implementation support', quantity: 24, price: 120, discount: 0, tax: 150 },
          { itemName: 'Subscription', description: 'Monthly plan', quantity: 1, price: 299, discount: 0, tax: 0 },
        ],
        notes: 'Thank you for your business.',
      },
      {
        invoiceNumber: formatInvoiceNumber(nextSeq++),
        clientName: 'Globex Corporation',
        issueDate: now,
        dueDate: in30,
        status: 'Unpaid',
        items: [
          { itemName: 'Onboarding Package', description: 'Setup and training', quantity: 1, price: 1500, discount: 100, tax: 80 },
          { itemName: 'Additional Seats', description: '5 seats', quantity: 5, price: 35, discount: 0, tax: 0 },
        ],
        notes: 'Net 30 terms apply.',
      },
      {
        invoiceNumber: formatInvoiceNumber(nextSeq++),
        clientName: 'Stark Industries',
        issueDate: now,
        dueDate: in7,
        status: 'Draft',
        items: [
          { itemName: 'Custom Integration', description: 'API work', quantity: 12, price: 200, discount: 50, tax: 120 },
        ],
      },
      {
        invoiceNumber: formatInvoiceNumber(nextSeq++),
        clientName: 'Wayne Enterprises',
        issueDate: new Date(now.getFullYear(), now.getMonth(), 1),
        dueDate: new Date(now.getFullYear(), now.getMonth(), 10),
        status: 'Overdue',
        items: [
          { itemName: 'Annual License', description: 'Enterprise tier', quantity: 1, price: 12000, discount: 500, tax: 0 },
        ],
      },
    ];

    // Compute item totals and invoice amount
    const docs = samples.map((inv) => {
      const items = inv.items.map((it) => ({ ...it, total: computeItemTotal(it) }));
      return { ...inv, items, amount: computeInvoiceAmount(items) };
    });

    const created = await Invoice.insertMany(docs);
    console.log(`Inserted ${created.length} invoices.`);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

seed();


