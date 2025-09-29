const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/invoiceController');

// GET list with filters + stats
router.get('/', ctrl.getInvoices);
// Next invoice number
router.get('/next-number', ctrl.nextInvoiceNumber);
// Download PDF (must be before /:id route)
router.get('/:id/download', ctrl.downloadInvoicePDF);
// CRUD
router.get('/:id', ctrl.getInvoiceById);
router.post('/', ctrl.createInvoice);
router.put('/:id', ctrl.updateInvoice);
router.delete('/:id', ctrl.deleteInvoice);

module.exports = router;


