import PDFDocument from 'pdfkit';

/**
 * Generates a clean, professional PDF invoice and returns it as a Buffer.
 * @param invoice The invoice instance with included customer, creator, items, payments, and credit notes
 */
export async function generateInvoicePdfBuffer(invoice: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    // Colors
    const primaryColor = '#0F172A'; // Slate 900
    const secondaryColor = '#475569'; // Slate 600
    const lightBg = '#F8FAFC'; // Slate 50
    const borderColor = '#E2E8F0'; // Slate 200
    const accentColor = '#DC2626'; // Red 600 for unpaid balance

    // ─── Header Section ─────────────────────────────────────────────────────────
    doc.fillColor(primaryColor)
      .fontSize(20)
      .text('ENTERPRISE CRM LTD.', 50, 50, { align: 'left' });

    doc.fontSize(9)
      .fillColor(secondaryColor)
      .text('100 Innovation Way, Suite 400', 50, 75)
      .text('San Francisco, CA 94107', 50, 88)
      .text('support@enterprisecrm.com | +1 (555) 019-2834', 50, 101);

    // Document Title
    doc.fillColor(primaryColor)
      .fontSize(24)
      .text('TAX INVOICE', 350, 50, { align: 'right' });

    doc.fontSize(10)
      .fillColor(secondaryColor)
      .text(`Invoice Number: ${invoice.invoice_number}`, 350, 80, { align: 'right' })
      .text(`Date: ${invoice.date}`, 350, 95, { align: 'right' })
      .text(`Due Date: ${invoice.due_date}`, 350, 110, { align: 'right' })
      .text(`Status: ${invoice.status.toUpperCase()}`, 350, 125, { align: 'right' });

    // Divider Line
    doc.moveTo(50, 150)
       .lineTo(545, 150)
       .strokeColor(borderColor)
       .lineWidth(1)
       .stroke();

    // ─── Address Blocks ─────────────────────────────────────────────────────────
    const customer = invoice.customer || {};
    const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Valued Customer';
    
    doc.fontSize(12)
      .fillColor(primaryColor)
      .text('Invoice To:', 50, 170);

    doc.fontSize(10)
      .fillColor(secondaryColor)
      .text(customerName, 50, 190)
      .text(customer.company_name || 'N/A', 50, 205)
      .text(customer.email || 'N/A', 50, 220);

    const creator = invoice.creator || {};
    const creatorName = `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Billing Specialist';

    doc.fontSize(12)
      .fillColor(primaryColor)
      .text('Billing Inquiries:', 300, 170);

    doc.fontSize(10)
      .fillColor(secondaryColor)
      .text(creatorName, 300, 190)
      .text('Accounts Receivable Department', 300, 205)
      .text(creator.email || 'billing@enterprisecrm.com', 300, 220);

    // Subject
    doc.fontSize(11)
      .fillColor(primaryColor)
      .text(`Subject: ${invoice.subject}`, 50, 250);

    // Divider
    doc.moveTo(50, 270)
       .lineTo(545, 270)
       .strokeColor(borderColor)
       .stroke();

    // ─── Items Table ────────────────────────────────────────────────────────────
    let y = 290;

    // Header
    doc.rect(50, y, 495, 20)
       .fill(lightBg);

    doc.fillColor(primaryColor)
      .fontSize(9)
      .text('Item Description', 60, y + 6)
      .text('Qty', 270, y + 6, { width: 30, align: 'right' })
      .text('Unit Price', 310, y + 6, { width: 70, align: 'right' })
      .text('Discount', 390, y + 6, { width: 45, align: 'right' })
      .text('Tax (GST)', 445, y + 6, { width: 45, align: 'right' })
      .text('Total', 500, y + 6, { width: 35, align: 'right' });

    y += 20;

    const items = invoice.items || [];
    items.forEach((item: any, index: number) => {
      if (index % 2 === 0) {
        doc.rect(50, y, 495, 22)
           .fill('#FFFFFF');
      } else {
        doc.rect(50, y, 495, 22)
           .fill('#FCFDFE');
      }

      const prodName = item.product?.name ? `(${item.product.sku || ''}) ${item.product.name}` : '';
      const desc = item.description || prodName || 'Custom Line Item';

      doc.fillColor(secondaryColor)
        .fontSize(9)
        .text(desc, 60, y + 6, { width: 200, height: 12, ellipsis: true })
        .text(Number(item.quantity).toFixed(0), 270, y + 6, { width: 30, align: 'right' })
        .text(`$${Number(item.unit_price).toFixed(2)}`, 310, y + 6, { width: 70, align: 'right' })
        .text(`$${Number(item.discount_amount).toFixed(2)}`, 390, y + 6, { width: 45, align: 'right' })
        .text(`$${Number(item.tax_amount).toFixed(2)}`, 445, y + 6, { width: 45, align: 'right' })
        .text(`$${Number(item.total).toFixed(2)}`, 500, y + 6, { width: 35, align: 'right' });

      y += 22;

      if (y > 580) {
        doc.addPage();
        y = 50;
      }
    });

    // Divider
    doc.moveTo(50, y + 5)
       .lineTo(545, y + 5)
       .strokeColor(borderColor)
       .stroke();

    y += 15;

    // ─── Summary / Totals ────────────────────────────────────────────────────────
    const labelX = 350;
    const valueX = 460;

    doc.fontSize(9).fillColor(secondaryColor);

    doc.text('Subtotal:', labelX, y)
       .text(`$${Number(invoice.subtotal).toFixed(2)}`, valueX, y, { align: 'right' });
    y += 15;

    if (Number(invoice.discount_amount) > 0) {
      doc.text(`Discount (${invoice.discount_type === 'percentage' ? `${invoice.discount_value}%` : 'Fixed'}):`, labelX, y)
         .text(`-$${Number(invoice.discount_amount).toFixed(2)}`, valueX, y, { align: 'right' });
      y += 15;
    }

    if (Number(invoice.tax_amount) > 0) {
      doc.text('Tax Total:', labelX, y)
         .text(`$${Number(invoice.tax_amount).toFixed(2)}`, valueX, y, { align: 'right' });
      y += 15;
    }

    if (Number(invoice.adjustment) !== 0) {
      const isNegative = Number(invoice.adjustment) < 0;
      doc.text('Adjustment:', labelX, y)
         .text(`${isNegative ? '-' : ''}$${Math.abs(Number(invoice.adjustment)).toFixed(2)}`, valueX, y, { align: 'right' });
      y += 15;
    }

    doc.text('Amount Paid:', labelX, y)
       .text(`$${Number(invoice.amount_paid).toFixed(2)}`, valueX, y, { align: 'right' });
    y += 15;

    doc.moveTo(labelX, y + 2)
       .lineTo(545, y + 2)
       .strokeColor(borderColor)
       .stroke();
    y += 7;

    doc.fontSize(11)
       .fillColor(primaryColor)
       .text('Grand Total:', labelX, y)
       .text(`$${Number(invoice.total).toFixed(2)}`, valueX, y, { align: 'right' });
    y += 18;

    const balance = Number(invoice.balance_due);
    doc.fontSize(11)
       .fillColor(balance > 0 ? accentColor : '#059669')
       .text('Balance Due:', labelX, y)
       .text(`$${balance.toFixed(2)}`, valueX, y, { align: 'right' });

    y += 30;

    // ─── Payments / Transactions Box ─────────────────────────────────────────────
    const payments = invoice.payments || [];
    if (payments.length > 0) {
      doc.fontSize(10)
        .fillColor(primaryColor)
        .text('Payment History', 50, y);
      
      y += 15;
      
      // Header row
      doc.rect(50, y, 280, 15).fill(lightBg);
      doc.fontSize(8)
         .fillColor(primaryColor)
         .text('Date', 55, y + 4)
         .text('Method', 115, y + 4)
         .text('Ref Number', 190, y + 4)
         .text('Amount', 280, y + 4, { align: 'right', width: 45 });
      
      y += 15;
      
      payments.forEach((payment: any) => {
        doc.fontSize(8)
           .fillColor(secondaryColor)
           .text(payment.payment_date, 55, y + 4)
           .text(payment.payment_method.replace('_', ' ').toUpperCase(), 115, y + 4)
           .text(payment.transaction_reference || '-', 190, y + 4, { width: 85, ellipsis: true })
           .text(`$${Number(payment.amount).toFixed(2)}`, 280, y + 4, { align: 'right', width: 45 });
        
        y += 14;
        
        if (y > 720) {
          doc.addPage();
          y = 50;
        }
      });
      
      y += 15;
    }

    // ─── Notes & Terms ──────────────────────────────────────────────────────────
    if (y > 700) {
      doc.addPage();
      y = 50;
    }

    if (invoice.terms_conditions) {
      doc.fontSize(10)
        .fillColor(primaryColor)
        .text('Terms and Conditions', 50, y);
      doc.fontSize(8)
        .fillColor(secondaryColor)
        .text(invoice.terms_conditions, 50, y + 15, { width: 250 });
    }

    if (invoice.customer_notes) {
      doc.fontSize(10)
        .fillColor(primaryColor)
        .text('Notes / Remarks', 300, y);
      doc.fontSize(8)
        .fillColor(secondaryColor)
        .text(invoice.customer_notes, 300, y + 15, { width: 245 });
    }

    // Page Number Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fontSize(8)
        .fillColor(secondaryColor)
        .text(`Page ${i + 1} of ${pageCount}`, 50, 780, { align: 'center' });
    }

    doc.end();
  });
}
