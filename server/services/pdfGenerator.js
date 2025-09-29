const { jsPDF } = require('jspdf');

class PDFGenerator {
  static generateInvoicePDF(invoice) {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
    
    // Helper function to get currency symbol
    const getCurrencySymbol = (currency) => {
      switch(currency) {
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

    let yPosition = 20;

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 20, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 20, 20, { align: 'right' });
    doc.text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, pageWidth - 20, 28, { align: 'right' });
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, pageWidth - 20, 36, { align: 'right' });

    yPosition = 60;

    // Company Info (Left side)
    doc.setTextColor(...darkGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('NexusERP', 20, yPosition);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Enterprise Dashboard System', 20, yPosition + 8);
    doc.text('123 Business Street', 20, yPosition + 16);
    doc.text('Business City, BC 12345', 20, yPosition + 24);
    doc.text('Phone: +1 (555) 123-4567', 20, yPosition + 32);
    doc.text('Email: contact@nexuserp.com', 20, yPosition + 40);

    // Client Info (Right side)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', pageWidth - 100, yPosition);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.clientName, pageWidth - 100, yPosition + 8);
    doc.text('Client Address', pageWidth - 100, yPosition + 16);
    doc.text('City, State ZIP', pageWidth - 100, yPosition + 24);

    yPosition = 130;

    // Status Badge
    const statusColors = {
      'Paid': [34, 197, 94],
      'Unpaid': [251, 191, 36],
      'Overdue': [239, 68, 68],
      'Draft': [107, 114, 128]
    };
    
    const statusColor = statusColors[invoice.status] || [107, 114, 128];
    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth - 60, yPosition - 15, 50, 10, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.status.toUpperCase(), pageWidth - 35, yPosition - 9, { align: 'center' });

    yPosition = 150;

    // Items Table Header
    doc.setTextColor(...darkGray);
    doc.setFillColor(...lightGray);
    doc.rect(20, yPosition - 10, pageWidth - 40, 15, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 25, yPosition - 3);
    doc.text('Description', 80, yPosition - 3);
    doc.text('Qty', 140, yPosition - 3);
    doc.text('Price', 155, yPosition - 3);
    doc.text('Discount', 175, yPosition - 3);
    doc.text('Tax', 195, yPosition - 3);
    doc.text('Total', pageWidth - 25, yPosition - 3, { align: 'right' });

    yPosition += 10;

    // Items
    doc.setFont('helvetica', 'normal');
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    invoice.items.forEach((item, index) => {
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(item.itemName || '-', 25, yPosition);
      doc.text(item.description || '-', 80, yPosition);
      doc.text(item.quantity.toString(), 140, yPosition);
      doc.text(`${getCurrencySymbol(invoice.currency)}${item.price.toFixed(2)}`, 155, yPosition);
      doc.text(`${getCurrencySymbol(invoice.currency)}${(item.discount || 0).toFixed(2)}`, 175, yPosition);
      doc.text(`${getCurrencySymbol(invoice.currency)}${(item.tax || 0).toFixed(2)}`, 195, yPosition);
      doc.text(`${getCurrencySymbol(invoice.currency)}${item.total.toFixed(2)}`, pageWidth - 25, yPosition, { align: 'right' });

      subtotal += item.quantity * item.price;
      totalDiscount += item.discount || 0;
      totalTax += item.tax || 0;
      yPosition += 8;
    });

    yPosition += 10;

    // Totals Section
    const totalsX = pageWidth - 80;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Subtotal:', totalsX, yPosition, { align: 'right' });
    doc.text(`${getCurrencySymbol(invoice.currency)}${subtotal.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 8;
    
    doc.text('Discount:', totalsX, yPosition, { align: 'right' });
    doc.text(`${getCurrencySymbol(invoice.currency)}${totalDiscount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 8;
    
    doc.text('Tax:', totalsX, yPosition, { align: 'right' });
    doc.text(`${getCurrencySymbol(invoice.currency)}${totalTax.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 8;
    
    // Total line
    doc.setLineWidth(0.5);
    doc.line(totalsX - 10, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', totalsX, yPosition, { align: 'right' });
    doc.text(`${getCurrencySymbol(invoice.currency)}${invoice.amount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

    yPosition += 20;

    // Notes Section
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

    // Footer
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
