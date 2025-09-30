const { jsPDF } = require('jspdf');

class PDFGenerator {
  static generateInvoicePDF(invoice) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Helper function to get currency symbol
      const getCurrencySymbol = (currency) => {
        switch (currency) {
          case 'INR': return '₹';
          case 'EUR': return '€';
          case 'GBP': return '£';
          default: return '$';
        }
      };

      // Colors
      const primaryColor = [103, 58, 183]; // Purple
      const secondaryColor = [59, 130, 246]; // Blue
      const lightGray = [243, 244, 246];
      const darkGray = [55, 65, 81];

      // Layout margins (keeps other components untouched)
      const marginLeft = 20;
      const marginRight = 20;
      const usableWidth = pageWidth - marginLeft - marginRight;

      let yPosition = 20;

      // Header (unchanged)
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', 20, 25);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 20, 20, { align: 'right' });
      doc.text(`Date: ${invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : '-'}`, pageWidth - 20, 28, { align: 'right' });
      doc.text(`Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}`, pageWidth - 20, 36, { align: 'right' });

      yPosition = 60;

      // Company Info (Left side) - unchanged except use invoice fields if provided
      doc.setTextColor(...darkGray);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(invoice.companyName || 'NexusERP', 20, yPosition);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.companyTagline || 'Enterprise Dashboard System', 20, yPosition + 8);
      doc.text(invoice.companyAddressLine1 || '123 Business Street', 20, yPosition + 16);
      doc.text(invoice.companyAddressLine2 || 'Business City, BC 12345', 20, yPosition + 24);
      if (invoice.companyPhone) doc.text(`Phone: ${invoice.companyPhone}`, 20, yPosition + 32);
      if (invoice.companyEmail) doc.text(`Email: ${invoice.companyEmail}`, 20, yPosition + 40);

      // Client Info (Right side)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', pageWidth - 100, yPosition);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.clientName || 'Client Name', pageWidth - 100, yPosition + 8);
      if (invoice.clientAddressLine1) doc.text(invoice.clientAddressLine1, pageWidth - 100, yPosition + 16);
      if (invoice.clientAddressLine2) doc.text(invoice.clientAddressLine2, pageWidth - 100, yPosition + 24);

      yPosition = 130;

      // Status Badge (unchanged)
      const statusColors = {
        'Paid': [34, 197, 94],
        'Unpaid': [251, 191, 36],
        'Overdue': [239, 68, 68],
        'Draft': [107, 114, 128]
      };

      const statusColor = statusColors[(invoice.status || '').toString()] || [107, 114, 128];
      doc.setFillColor(...statusColor);
      doc.roundedRect(pageWidth - 60, yPosition - 15, 50, 10, 5, 5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text((invoice.status || 'DRAFT').toString().toUpperCase(), pageWidth - 35, yPosition - 9, { align: 'center' });

      yPosition = 150;

      // ---------------------------
      // TABLE IMPROVEMENTS START
      // ---------------------------
      // Column proportions (sum = 1)
      // tightened numeric columns and a wrapped description column
      const colProportions = {
        item: 0.14,       // small
        description: 0.20,// wrapped column
        qty: 0.07,        // center
        price: 0.16,      // right
        discount: 0.16,   // right
        tax: 0.12,        // right
        total: 0.14       // right (kept larger)
      };

      // Compute column widths and X positions
      const cols = [];
      let curX = marginLeft;
      Object.keys(colProportions).forEach((key) => {
        const w = Math.round(usableWidth * colProportions[key]);
        cols.push({ key, x: curX, width: w });
        curX += w;
      });

      // Visual parameters for table
      const tableHeaderHeight = 15;
      const fontSizeTableHeader = 10;
      const fontSizeTable = 10;
      const cellPadding = 4;
      const lineHeight = fontSizeTable * 1.15;
      const bottomMarginForTable = 60; // space for totals/footer

      // Helper to draw table header at a given y
      function drawTableHeader(y) {
        doc.setTextColor(...darkGray);
        doc.setFillColor(...lightGray);
        doc.rect(marginLeft, y - tableHeaderHeight + 3, usableWidth, tableHeaderHeight, 'F');

        doc.setFontSize(fontSizeTableHeader);
        doc.setFont('helvetica', 'bold');

        // headers and alignments
        const headers = {
          item: 'Item',
          description: 'Description',
          qty: 'Qty',
          price: 'Price',
          discount: 'Discount',
          tax: 'Tax',
          total: 'Total'
        };

        cols.forEach((col) => {
          const h = headers[col.key];
          const tx = col.x + cellPadding;
          const ty = y - tableHeaderHeight + cellPadding + lineHeight * 0.7;
          // choose alignment
          if (['price', 'discount', 'tax', 'total'].includes(col.key)) {
            // right align header
            doc.text(h, col.x + col.width - cellPadding, ty, { align: 'right' });
          } else if (col.key === 'qty') {
            doc.text(h, col.x + col.width / 2, ty, { align: 'center' });
          } else {
            doc.text(h, tx, ty);
          }
        });

        // bottom border for header
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(marginLeft, y + 3, marginLeft + usableWidth, y + 3);
      }

      // Draw table header initially
      drawTableHeader(yPosition);

      // move yPosition to first row (a bit below header)
      yPosition += 8;

      // draw rows dynamically with wrapping
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSizeTable);

      const itemsArray = Array.isArray(invoice.items) ? invoice.items : [];

      let subtotal = 0;
      let totalDiscount = 0;
      let totalTax = 0;

      for (let i = 0; i < itemsArray.length; i++) {
        const item = itemsArray[i] || {};

        // Build cell content strings
        const cellTexts = {
          item: item.itemName || '-',
          description: item.description || '-',
          qty: (item.quantity != null) ? String(item.quantity) : '0',
          price: (item.price != null) ? `${getCurrencySymbol(invoice.currency)}${Number(item.price).toFixed(2)}` : `${getCurrencySymbol(invoice.currency)}0.00`,
          discount: (item.discount != null) ? `${getCurrencySymbol(invoice.currency)}${Number(item.discount).toFixed(2)}` : `${getCurrencySymbol(invoice.currency)}0.00`,
          tax: (item.tax != null) ? `${getCurrencySymbol(invoice.currency)}${Number(item.tax).toFixed(2)}` : `${getCurrencySymbol(invoice.currency)}0.00`,
          total: (item.total != null) ? `${getCurrencySymbol(invoice.currency)}${Number(item.total).toFixed(2)}` : null
        };

        // if total not provided, compute it softly
        const qtyVal = Number(item.quantity || 0);
        const priceVal = Number(item.price || 0);
        const discountVal = Number(item.discount || 0);
        const taxVal = Number(item.tax || 0);
        const computedLineTotal = qtyVal * priceVal - discountVal + taxVal;
        if (!cellTexts.total) cellTexts.total = `${getCurrencySymbol(invoice.currency)}${computedLineTotal.toFixed(2)}`;

        // split/wrap texts for columns that need wrapping
        const wrapped = {};
        cols.forEach((col) => {
          const availW = col.width - cellPadding * 2;
          // For numeric columns we display a single line (no need to wrap)
          if (['qty', 'price', 'discount', 'tax', 'total'].includes(col.key)) {
            wrapped[col.key] = [cellTexts[col.key]];
          } else {
            wrapped[col.key] = doc.splitTextToSize(String(cellTexts[col.key]), availW);
          }
        });

        // calculate max lines to determine row height
        const maxLines = Math.max(...cols.map(c => wrapped[c.key].length));
        const rowHeight = Math.max(tableHeaderHeight, maxLines * lineHeight + cellPadding * 2);

        // Page break check: if this row would overflow, add page and re-draw header
        if (yPosition + rowHeight + bottomMarginForTable > pageHeight) {
          doc.addPage();
          // re-draw header area (header stripe + invoice metadata kept as-is to avoid interfering other components)
          // Minimal header redraw for table continuity:
          yPosition = 20; // top margin on new page
          drawTableHeader(yPosition);
          yPosition += 8;
        }

        // draw cell texts with alignment
        cols.forEach((col) => {
          const lines = wrapped[col.key];
          const startX = col.x + cellPadding;
          const startY = yPosition + cellPadding + lineHeight * 0.8; // baseline
          if (['price', 'discount', 'tax', 'total'].includes(col.key)) {
            // right align
            lines.forEach((ln, idx) => {
              doc.text(String(ln), col.x + col.width - cellPadding, startY + idx * lineHeight, { align: 'right' });
            });
          } else if (col.key === 'qty') {
            // center
            lines.forEach((ln, idx) => {
              doc.text(String(ln), col.x + col.width / 2, startY + idx * lineHeight, { align: 'center' });
            });
          } else {
            // left align
            lines.forEach((ln, idx) => {
              doc.text(String(ln), startX, startY + idx * lineHeight);
            });
          }
        });

        // draw horizontal separator line after row
        doc.setDrawColor(220);
        doc.setLineWidth(0.4);
        doc.line(marginLeft, yPosition + rowHeight, marginLeft + usableWidth, yPosition + rowHeight);

        // increment yPosition by rowHeight + small gap
        yPosition += rowHeight + 4;

        // accumulate totals (use numeric values)
        subtotal += qtyVal * priceVal;
        totalDiscount += discountVal;
        totalTax += taxVal;
      }

      // ---------------------------
      // TABLE IMPROVEMENTS END
      // ---------------------------

      // Totals Section (unchanged positions but defensive)
      yPosition += 6;
      const totalsX = pageWidth - 80;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      doc.text('Subtotal:', totalsX, yPosition, { align: 'right' });
      doc.text(`${getCurrencySymbol(invoice.currency)}${(subtotal || 0).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 8;

      doc.text('Discount:', totalsX, yPosition, { align: 'right' });
      doc.text(`${getCurrencySymbol(invoice.currency)}${(totalDiscount || 0).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 8;

      doc.text('Tax:', totalsX, yPosition, { align: 'right' });
      doc.text(`${getCurrencySymbol(invoice.currency)}${(totalTax || 0).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 8;

      // Total line
      doc.setLineWidth(0.5);
      doc.line(totalsX - 10, yPosition, pageWidth - 20, yPosition);
      yPosition += 8;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', totalsX, yPosition, { align: 'right' });

      const finalAmount = (typeof invoice.amount === 'number') ? invoice.amount : subtotal - totalDiscount + totalTax;
      doc.text(`${getCurrencySymbol(invoice.currency)}${(finalAmount || 0).toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

      yPosition += 20;

      // Notes Section (unchanged)
      if (invoice.notes) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Notes:', 20, yPosition);
        yPosition += 8;

        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 40);
        doc.text(splitNotes, 20, yPosition);
        yPosition += splitNotes.length * 5;
      }

      yPosition += 20;

      // Footer (unchanged)
      if (yPosition < pageHeight - 40) {
        doc.setFillColor(...lightGray);
        doc.rect(20, yPosition, pageWidth - 40, 30, 'F');

        doc.setTextColor(...darkGray);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Thank you for your business!', 25, yPosition + 10);
        doc.text('For any queries, contact us at contact@nexuserp.com', 25, yPosition + 18);

        doc.text('Generated on: ' + new Date().toLocaleDateString(), pageWidth - 25, yPosition + 10, { align: 'right' });
        doc.text('NexusERP Invoice System', pageWidth - 25, yPosition + 18, { align: 'right' });
      }

      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF: ' + error.message);
    }
  }
}

module.exports = PDFGenerator;
