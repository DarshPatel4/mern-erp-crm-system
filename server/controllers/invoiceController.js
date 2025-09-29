const Invoice = require('../models/Invoice');
const PDFGenerator = require('../services/pdfGenerator');

// Utility to compute totals for items and invoice
function computeItemTotal(item) {
  const subtotal = item.quantity * item.price;
  const discountAmount = item.discount || 0;
  const taxAmount = item.tax || 0;
  return Math.max(0, subtotal - discountAmount + taxAmount);
}

function computeInvoiceAmount(items) {
  return items.reduce((sum, it) => sum + computeItemTotal(it), 0);
}

exports.getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, client, q, startDate, endDate } = req.query;

    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (client && client !== 'All') filter.clientName = client;
    if (q) {
      filter.$or = [
        { invoiceNumber: new RegExp(q, 'i') },
        { clientName: new RegExp(q, 'i') },
      ];
    }
    if (startDate || endDate) {
      filter.issueDate = {};
      if (startDate) filter.issueDate.$gte = new Date(startDate);
      if (endDate) filter.issueDate.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, totalCount, stats] = await Promise.all([
      Invoice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Invoice.countDocuments(filter),
      // Stats for header cards
      (async () => {
        const totalInvoices = await Invoice.countDocuments({});

        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const [thisMonthRevenue, lastMonthRevenue] = await Promise.all([
          Invoice.aggregate([
            { $match: { issueDate: { $gte: startOfThisMonth } } },
            { $group: { _id: null, sum: { $sum: '$amount' } } },
          ]),
          Invoice.aggregate([
            { $match: { issueDate: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, sum: { $sum: '$amount' } } },
          ]),
        ]);

        const revenue = thisMonthRevenue[0]?.sum || 0;
        const lastRevenue = lastMonthRevenue[0]?.sum || 0;
        const revenueChange = lastRevenue === 0 ? (revenue > 0 ? 100 : 0) : ((revenue - lastRevenue) / lastRevenue) * 100;

        const unpaid = await Invoice.aggregate([
          { $match: { status: { $in: ['Unpaid', 'Draft'] } } },
          { $group: { _id: null, count: { $sum: 1 }, sum: { $sum: '$amount' } } },
        ]);

        const overdue = await Invoice.aggregate([
          { $match: { status: 'Overdue' } },
          { $group: { _id: null, count: { $sum: 1 }, sum: { $sum: '$amount' } } },
        ]);

        const lastMonthCount = await Invoice.countDocuments({
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
        });
        const thisMonthCount = await Invoice.countDocuments({ createdAt: { $gte: startOfThisMonth } });
        const countChange = lastMonthCount === 0 ? (thisMonthCount > 0 ? 100 : 0) : ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;

        return {
          totalInvoices,
          totalRevenue: revenue,
          revenueChange,
          unpaidCount: unpaid[0]?.count || 0,
          unpaidAmount: unpaid[0]?.sum || 0,
          overdueCount: overdue[0]?.count || 0,
          overdueAmount: overdue[0]?.sum || 0,
          invoicesChange: countChange,
        };
      })(),
    ]);

    res.json({
      data: items,
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      stats,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoices', error: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoice', error: err.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      clientId,
      clientName,
      employeeId,
      items = [],
      issueDate,
      dueDate,
      status = 'Unpaid',
      notes,
      currency = 'USD',
    } = req.body;

    const normalizedItems = items.map((it) => ({
      itemName: it.itemName,
      description: it.description,
      quantity: Number(it.quantity || 0),
      price: Number(it.price || 0),
      discount: Number(it.discount || 0),
      tax: Number(it.tax || 0),
      total: computeItemTotal({
        quantity: Number(it.quantity || 0),
        price: Number(it.price || 0),
        discount: Number(it.discount || 0),
        tax: Number(it.tax || 0),
      }),
    }));

    const amount = computeInvoiceAmount(normalizedItems);

    const created = await Invoice.create({
      invoiceNumber,
      clientId,
      clientName,
      employeeId,
      items: normalizedItems,
      amount,
      issueDate,
      dueDate,
      status,
      notes,
      currency,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create invoice', error: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const update = { ...req.body };
    if (Array.isArray(update.items)) {
      update.items = update.items.map((it) => ({
        itemName: it.itemName,
        description: it.description,
        quantity: Number(it.quantity || 0),
        price: Number(it.price || 0),
        discount: Number(it.discount || 0),
        tax: Number(it.tax || 0),
        total: computeItemTotal({
          quantity: Number(it.quantity || 0),
          price: Number(it.price || 0),
          discount: Number(it.discount || 0),
          tax: Number(it.tax || 0),
        }),
      }));
      update.amount = computeInvoiceAmount(update.items);
    }

    const updated = await Invoice.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update invoice', error: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete invoice', error: err.message });
  }
};

exports.nextInvoiceNumber = async (_req, res) => {
  try {
    const last = await Invoice.findOne({}).sort({ createdAt: -1 });
    let next = 'INV-2023-001';
    if (last?.invoiceNumber) {
      const parts = last.invoiceNumber.split('-');
      const seq = parseInt(parts[2], 10) + 1;
      next = `${parts[0]}-${parts[1]}-${String(seq).padStart(3, '0')}`;
    }
    res.json({ invoiceNumber: next });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate invoice number', error: err.message });
  }
};

exports.downloadInvoicePDF = async (req, res) => {
  try {
    console.log('Download PDF request for invoice ID:', req.params.id);
    
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      console.log('Invoice not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Invoice not found' });
    }

    console.log('Invoice found:', invoice.invoiceNumber);
    const pdf = PDFGenerator.generateInvoicePDF(invoice);
    const pdfBuffer = pdf.output('arraybuffer');
    
    console.log('PDF generated successfully, size:', pdfBuffer.byteLength);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.byteLength);
    
    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error('Error in downloadInvoicePDF:', err);
    res.status(500).json({ message: 'Failed to generate PDF', error: err.message });
  }
};


