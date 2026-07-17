import { sequelize, Customer, Quotation, Product, Tax } from '../models';
import { AppError } from '../utils/error.helper';
import * as repo from './invoices.repository';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreatePaymentDto,
  CreateCreditNoteDto,
  InvoiceFilters,
} from './invoices.types';

// ─── Unique Sequence Code Generators ───────────────────────────────────────────

async function generateNextInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear().toString();
  const latestNumber = await repo.getLatestInvoiceNumber(currentYear);

  let nextSeq = 1;
  if (latestNumber) {
    const parts = latestNumber.split('-');
    const seqPart = parts[parts.length - 1];
    const parsedSeq = parseInt(seqPart, 10);
    if (!isNaN(parsedSeq)) {
      nextSeq = parsedSeq + 1;
    }
  }

  const paddedSeq = nextSeq.toString().padStart(4, '0');
  return `INV-${currentYear}-${paddedSeq}`;
}

async function generateNextPaymentNumber(): Promise<string> {
  const currentYear = new Date().getFullYear().toString();
  const latestNumber = await repo.getLatestPaymentNumber(currentYear);

  let nextSeq = 1;
  if (latestNumber) {
    const parts = latestNumber.split('-');
    const seqPart = parts[parts.length - 1];
    const parsedSeq = parseInt(seqPart, 10);
    if (!isNaN(parsedSeq)) {
      nextSeq = parsedSeq + 1;
    }
  }

  const paddedSeq = nextSeq.toString().padStart(4, '0');
  return `PAY-${currentYear}-${paddedSeq}`;
}

async function generateNextCreditNoteNumber(): Promise<string> {
  const currentYear = new Date().getFullYear().toString();
  const latestNumber = await repo.getLatestCreditNoteNumber(currentYear);

  let nextSeq = 1;
  if (latestNumber) {
    const parts = latestNumber.split('-');
    const seqPart = parts[parts.length - 1];
    const parsedSeq = parseInt(seqPart, 10);
    if (!isNaN(parsedSeq)) {
      nextSeq = parsedSeq + 1;
    }
  }

  const paddedSeq = nextSeq.toString().padStart(4, '0');
  return `CRN-${currentYear}-${paddedSeq}`;
}

// ─── Line Calculator Helper ─────────────────────────────────────────────────────

interface CalculatedItem {
  product_id?: number | null;
  description?: string | null;
  quantity: number;
  unit_price: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
  tax_id?: number | null;
  tax_rate: number;
  tax_amount: number;
  subtotal: number;
  total: number;
}

async function calculateLineItems(items: any[]): Promise<CalculatedItem[]> {
  const calculated: CalculatedItem[] = [];

  for (const item of items) {
    let taxRate = 0;
    let description = item.description || '';

    if (item.product_id) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        throw new AppError(`Product with ID ${item.product_id} not found`, 404);
      }
      if (!description) {
        description = product.name;
      }
    }

    if (item.tax_id) {
      const tax = await Tax.findByPk(item.tax_id);
      if (!tax) {
        throw new AppError(`Tax with ID ${item.tax_id} not found`, 404);
      }
      taxRate = Number(tax.rate);
    }

    const subtotal = Number(item.quantity) * Number(item.unit_price);

    let discountAmount = 0;
    const discountVal = Number(item.discount_value || 0);
    if (item.discount_type === 'percentage') {
      discountAmount = subtotal * (discountVal / 100);
    } else {
      discountAmount = discountVal;
    }
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (taxRate / 100);
    const total = taxableAmount + taxAmount;

    calculated.push({
      product_id: item.product_id || null,
      description,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      discount_type: item.discount_type || 'percentage',
      discount_value: discountVal,
      discount_amount: Number(discountAmount.toFixed(2)),
      tax_id: item.tax_id || null,
      tax_rate: Number(taxRate.toFixed(2)),
      tax_amount: Number(taxAmount.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      total: Number(total.toFixed(2)),
    });
  }

  return calculated;
}

// ─── Service Operations ──────────────────────────────────────────────────────────

export async function createInvoice(data: CreateInvoiceDto, userId: number) {
  // 1. Verify Customer
  const customer = await Customer.findByPk(data.customer_id);
  if (!customer) throw new AppError('Customer not found', 404);

  // 2. Verify optional quotation
  if (data.quotation_id) {
    const quote = await Quotation.findByPk(data.quotation_id);
    if (!quote) throw new AppError('Quotation not found', 404);
  }

  // 3. Compute Item pricing details
  const calculatedItems = await calculateLineItems(data.items);

  const itemsSubtotal = calculatedItems.reduce((acc, item) => acc + item.subtotal, 0);
  const itemsTaxAmount = calculatedItems.reduce((acc, item) => acc + item.tax_amount, 0);
  const itemsDiscountAmount = calculatedItems.reduce((acc, item) => acc + item.discount_amount, 0);

  // 4. Compute Document-level discount
  let docDiscountAmount = 0;
  const docDiscountVal = Number(data.discount_value || 0);
  if (data.discount_type === 'percentage') {
    docDiscountAmount = itemsSubtotal * (docDiscountVal / 100);
  } else {
    docDiscountAmount = docDiscountVal;
  }
  if (docDiscountAmount > itemsSubtotal) {
    docDiscountAmount = itemsSubtotal;
  }

  const docAdjustment = Number(data.adjustment || 0);

  const totalDiscount = itemsDiscountAmount + docDiscountAmount;
  const docTotal = itemsSubtotal - totalDiscount + itemsTaxAmount + docAdjustment;
  const finalTotal = Math.max(0, docTotal);

  // 5. Generate serial number
  const invoiceNumber = await generateNextInvoiceNumber();

  const result = await sequelize.transaction(async (t) => {
    const invoicePayload = {
      invoice_number: invoiceNumber,
      customer_id: data.customer_id,
      quotation_id: data.quotation_id || null,
      subject: data.subject,
      date: data.date,
      due_date: data.due_date,
      subtotal: Number(itemsSubtotal.toFixed(2)),
      discount_type: data.discount_type || 'percentage',
      discount_value: docDiscountVal,
      discount_amount: Number(docDiscountAmount.toFixed(2)),
      tax_amount: Number(itemsTaxAmount.toFixed(2)),
      adjustment: Number(docAdjustment.toFixed(2)),
      total: Number(finalTotal.toFixed(2)),
      amount_paid: 0.00,
      balance_due: Number(finalTotal.toFixed(2)),
      status: data.status || 'draft',
      terms_conditions: data.terms_conditions || null,
      customer_notes: data.customer_notes || null,
      created_by: userId,
    };

    return repo.createInvoice(invoicePayload, calculatedItems, t);
  });

  return repo.findInvoiceById(result.id);
}

export async function listInvoices(filters: InvoiceFilters) {
  return repo.listInvoices(filters);
}

export async function getInvoiceByUuid(uuid: string) {
  const invoice = await repo.findInvoiceByUuid(uuid);
  if (!invoice) throw new AppError('Invoice not found', 404);
  return invoice;
}

export async function updateInvoice(uuid: string, data: UpdateInvoiceDto) {
  const invoice = await repo.findInvoiceByUuid(uuid);
  if (!invoice) throw new AppError('Invoice not found', 404);

  let calculatedItems: CalculatedItem[] | undefined = undefined;
  let itemsSubtotal = Number(invoice.subtotal);
  let itemsTaxAmount = Number(invoice.tax_amount);
  let itemsDiscountAmount = Number(invoice.items?.reduce((acc: number, i: any) => acc + Number(i.discount_amount), 0) || 0);

  if (data.items !== undefined) {
    calculatedItems = await calculateLineItems(data.items);
    itemsSubtotal = calculatedItems.reduce((acc, item) => acc + item.subtotal, 0);
    itemsTaxAmount = calculatedItems.reduce((acc, item) => acc + item.tax_amount, 0);
    itemsDiscountAmount = calculatedItems.reduce((acc, item) => acc + item.discount_amount, 0);
  }

  const discountType = data.discount_type ?? invoice.discount_type;
  const discountValue = data.discount_value !== undefined ? Number(data.discount_value) : Number(invoice.discount_value);

  let docDiscountAmount = 0;
  if (discountType === 'percentage') {
    docDiscountAmount = itemsSubtotal * (discountValue / 100);
  } else {
    docDiscountAmount = discountValue;
  }
  if (docDiscountAmount > itemsSubtotal) {
    docDiscountAmount = itemsSubtotal;
  }

  const adjustment = data.adjustment !== undefined ? Number(data.adjustment) : Number(invoice.adjustment);

  const totalDiscount = itemsDiscountAmount + docDiscountAmount;
  const docTotal = itemsSubtotal - totalDiscount + itemsTaxAmount + adjustment;
  const finalTotal = Math.max(0, docTotal);

  // Recalculate balance
  const currentPaid = Number(invoice.amount_paid);
  const balanceDue = Math.max(0, finalTotal - currentPaid);

  // Auto status transition
  let status = data.status ?? invoice.status;
  if (status !== 'voided' && status !== 'draft') {
    if (balanceDue === 0 && finalTotal > 0) {
      status = 'paid';
    } else if (currentPaid > 0 && balanceDue > 0) {
      status = 'partially_paid';
    } else {
      status = 'unpaid';
    }
  }

  await sequelize.transaction(async (t) => {
    const invoicePayload = {
      customer_id: data.customer_id ?? invoice.customer_id,
      quotation_id: data.quotation_id !== undefined ? (data.quotation_id || null) : invoice.quotation_id,
      subject: data.subject ?? invoice.subject,
      date: data.date ?? invoice.date,
      due_date: data.due_date ?? invoice.due_date,
      subtotal: Number(itemsSubtotal.toFixed(2)),
      discount_type: discountType,
      discount_value: discountValue,
      discount_amount: Number(docDiscountAmount.toFixed(2)),
      tax_amount: Number(itemsTaxAmount.toFixed(2)),
      adjustment: Number(adjustment.toFixed(2)),
      total: Number(finalTotal.toFixed(2)),
      balance_due: Number(balanceDue.toFixed(2)),
      status,
      terms_conditions: data.terms_conditions !== undefined ? data.terms_conditions : invoice.terms_conditions,
      customer_notes: data.customer_notes !== undefined ? data.customer_notes : invoice.customer_notes,
    };

    await repo.updateInvoice(invoice, invoicePayload, calculatedItems, t);
  });

  return repo.findInvoiceById(invoice.id);
}

export async function deleteInvoice(uuid: string) {
  const invoice = await repo.findInvoiceByUuid(uuid);
  if (!invoice) throw new AppError('Invoice not found', 404);
  await repo.deleteInvoice(invoice);
}

// ─── Payment Service Operations ─────────────────────────────────────────────────

export async function recordPayment(invoiceUuid: string, data: CreatePaymentDto, userId: number) {
  const invoice = await repo.findInvoiceByUuid(invoiceUuid);
  if (!invoice) throw new AppError('Invoice not found', 404);

  const amount = Number(data.amount);
  if (amount <= 0) throw new AppError('Payment amount must be greater than zero', 400);

  const balanceDue = Number(invoice.balance_due);
  if (amount > balanceDue) {
    throw new AppError(`Payment amount ($${amount}) exceeds the remaining balance ($${balanceDue})`, 400);
  }

  const paymentNumber = await generateNextPaymentNumber();

  const updatedPaid = Number(invoice.amount_paid) + amount;
  const updatedBalance = Math.max(0, balanceDue - amount);

  let updatedStatus = invoice.status;
  if (updatedStatus !== 'voided') {
    if (updatedBalance === 0) {
      updatedStatus = 'paid';
    } else {
      updatedStatus = 'partially_paid';
    }
  }

  await sequelize.transaction(async (t) => {
    // 1. Write payment record
    const paymentPayload = {
      invoice_id: invoice.id,
      payment_number: paymentNumber,
      amount,
      payment_date: data.payment_date,
      payment_method: data.payment_method,
      transaction_reference: data.transaction_reference || null,
      notes: data.notes || null,
      created_by: userId,
    };
    await repo.createPayment(paymentPayload, t);

    // 2. Adjust invoice balances
    await invoice.update({
      amount_paid: Number(updatedPaid.toFixed(2)),
      balance_due: Number(updatedBalance.toFixed(2)),
      status: updatedStatus,
    }, { transaction: t });
  });

  return repo.findInvoiceById(invoice.id);
}

// ─── Credit Note Service Operations ──────────────────────────────────────────────

export async function issueCreditNote(invoiceUuid: string, data: CreateCreditNoteDto, userId: number) {
  const invoice = await repo.findInvoiceByUuid(invoiceUuid);
  if (!invoice) throw new AppError('Invoice not found', 404);

  const amount = Number(data.amount);
  if (amount <= 0) throw new AppError('Credit note amount must be greater than zero', 400);

  const balanceDue = Number(invoice.balance_due);
  if (amount > balanceDue) {
    throw new AppError(`Credit note amount ($${amount}) exceeds the remaining balance ($${balanceDue})`, 400);
  }

  const creditNoteNumber = await generateNextCreditNoteNumber();

  const isApplied = data.status === 'applied';

  await sequelize.transaction(async (t) => {
    // 1. Write credit note record
    const creditNotePayload = {
      invoice_id: invoice.id,
      credit_note_number: creditNoteNumber,
      amount,
      credit_note_date: data.credit_note_date,
      reason: data.reason,
      status: data.status || 'draft',
      created_by: userId,
    };
    await repo.createCreditNote(creditNotePayload, t);

    // 2. If status is 'applied', deduct from balance immediately
    if (isApplied) {
      const updatedBalance = Math.max(0, balanceDue - amount);
      const updatedPaid = Number(invoice.amount_paid) + amount; // Credits function like payment inputs

      let updatedStatus = invoice.status;
      if (updatedStatus !== 'voided') {
        if (updatedBalance === 0) {
          updatedStatus = 'paid';
        } else {
          updatedStatus = 'partially_paid';
        }
      }

      await invoice.update({
        amount_paid: Number(updatedPaid.toFixed(2)),
        balance_due: Number(updatedBalance.toFixed(2)),
        status: updatedStatus,
      }, { transaction: t });
    }
  });

  return repo.findInvoiceById(invoice.id);
}
