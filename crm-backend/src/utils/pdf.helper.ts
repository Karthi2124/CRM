import PDFDocument from 'pdfkit';

/**
 * Generates a clean, enterprise-grade PDF quotation and returns it as a Buffer.
 * @param quotation The quotation instance with included customer, creator, and items (with product and tax)
 */
export async function generateQuotationPdfBuffer(quotation: any): Promise<Buffer> {
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
      .text('QUOTATION', 350, 50, { align: 'right' });

    doc.fontSize(10)
      .fillColor(secondaryColor)
      .text(`Quote Number: ${quotation.quotation_number}`, 350, 80, { align: 'right' })
      .text(`Date: ${quotation.date}`, 350, 95, { align: 'right' })
      .text(`Valid Until: ${quotation.expiry_date}`, 350, 110, { align: 'right' })
      .text(`Status: ${quotation.status.toUpperCase()}`, 350, 125, { align: 'right' });

    // Divider Line
    doc.moveTo(50, 150)
       .lineTo(545, 150)
       .strokeColor(borderColor)
       .lineWidth(1)
       .stroke();

    // ─── Address Blocks ─────────────────────────────────────────────────────────
    const customer = quotation.customer || {};
    const customerName = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Valued Customer';
    
    doc.fontSize(12)
      .fillColor(primaryColor)
      .text('Prepared For:', 50, 170);

    doc.fontSize(10)
      .fillColor(secondaryColor)
      .text(customerName, 50, 190)
      .text(customer.company_name || 'N/A', 50, 205)
      .text(customer.email || 'N/A', 50, 220);

    const creator = quotation.creator || {};
    const creatorName = `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Sales Representative';

    doc.fontSize(12)
      .fillColor(primaryColor)
      .text('Prepared By:', 300, 170);

    doc.fontSize(10)
      .fillColor(secondaryColor)
      .text(creatorName, 300, 190)
      .text('Enterprise CRM Representative', 300, 205)
      .text(creator.email || 'sales@enterprisecrm.com', 300, 220);

    // Subject
    doc.fontSize(11)
      .fillColor(primaryColor)
      .text(`Subject: ${quotation.subject}`, 50, 250);

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

    const items = quotation.items || [];
    items.forEach((item: any, index: number) => {
      // Alternate row backgrounds
      if (index % 2 === 0) {
        doc.rect(50, y, 495, 22)
           .fill('#FFFFFF');
      } else {
        doc.rect(50, y, 495, 22)
           .fill('#FCFDFE');
      }

      // Check text content
      const prodName = item.product?.name ? `(${item.product.sku || ''}) ${item.product.name}` : '';
      const desc = item.description || prodName || 'Custom Item';

      doc.fillColor(secondaryColor)
        .fontSize(9)
        .text(desc, 60, y + 6, { width: 200, height: 12, ellipsis: true })
        .text(Number(item.quantity).toFixed(0), 270, y + 6, { width: 30, align: 'right' })
        .text(`$${Number(item.unit_price).toFixed(2)}`, 310, y + 6, { width: 70, align: 'right' })
        .text(`$${Number(item.discount_amount).toFixed(2)}`, 390, y + 6, { width: 45, align: 'right' })
        .text(`$${Number(item.tax_amount).toFixed(2)}`, 445, y + 6, { width: 45, align: 'right' })
        .text(`$${Number(item.total).toFixed(2)}`, 500, y + 6, { width: 35, align: 'right' });

      y += 22;

      // Check if table goes outside height bounds
      if (y > 600) {
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
       .text(`$${Number(quotation.subtotal).toFixed(2)}`, valueX, y, { align: 'right' });
    y += 15;

    if (Number(quotation.discount_amount) > 0) {
      doc.text(`Discount (${quotation.discount_type === 'percentage' ? `${quotation.discount_value}%` : 'Fixed'}):`, labelX, y)
         .text(`-$${Number(quotation.discount_amount).toFixed(2)}`, valueX, y, { align: 'right' });
      y += 15;
    }

    if (Number(quotation.tax_amount) > 0) {
      doc.text('Tax Total:', labelX, y)
         .text(`$${Number(quotation.tax_amount).toFixed(2)}`, valueX, y, { align: 'right' });
      y += 15;
    }

    if (Number(quotation.adjustment) !== 0) {
      const isNegative = Number(quotation.adjustment) < 0;
      doc.text('Adjustment:', labelX, y)
         .text(`${isNegative ? '-' : ''}$${Math.abs(Number(quotation.adjustment)).toFixed(2)}`, valueX, y, { align: 'right' });
      y += 15;
    }

    doc.moveTo(labelX, y + 2)
       .lineTo(545, y + 2)
       .strokeColor(borderColor)
       .stroke();
    y += 7;

    doc.fontSize(11)
       .fillColor(primaryColor)
       .text('Grand Total:', labelX, y)
       .text(`$${Number(quotation.total).toFixed(2)}`, valueX, y, { align: 'right' });

    y += 30;

    // ─── Notes & Terms ──────────────────────────────────────────────────────────
    if (quotation.terms_conditions) {
      doc.fontSize(10)
        .fillColor(primaryColor)
        .text('Terms and Conditions', 50, y);
      doc.fontSize(8)
        .fillColor(secondaryColor)
        .text(quotation.terms_conditions, 50, y + 15, { width: 250 });
    }

    if (quotation.customer_notes) {
      doc.fontSize(10)
        .fillColor(primaryColor)
        .text('Notes / Remarks', 300, y);
      doc.fontSize(8)
        .fillColor(secondaryColor)
        .text(quotation.customer_notes, 300, y + 15, { width: 245 });
    }

    // Page Number footer
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
