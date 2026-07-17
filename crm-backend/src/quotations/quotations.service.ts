import { sequelize, Customer, Lead, Opportunity, Product, Tax } from '../models';
import { AppError } from '../utils/error.helper';
import * as repo from './quotations.repository';
import { CreateQuotationDto, UpdateQuotationDto, QuotationFilters } from './quotations.types';

// ─── Number Generator ───────────────────────────────────────────────────────────
async function generateNextQuotationNumber(): Promise<string> {
  const currentYear = new Date().getFullYear().toString(); // e.g. '2026'
  const latestNumber = await repo.getLatestQuotationNumber(currentYear);

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
  return `QT-${currentYear}-${paddedSeq}`;
}

// ─── Item Calculator Helper ─────────────────────────────────────────────────────
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

    // 1. Verify Product if product_id is provided
    if (item.product_id) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        throw new AppError(`Product with ID ${item.product_id} not found`, 404);
      }
      if (!description) {
        description = product.name;
      }
    }

    // 2. Fetch Tax if tax_id is provided
    if (item.tax_id) {
      const tax = await Tax.findByPk(item.tax_id);
      if (!tax) {
        throw new AppError(`Tax with ID ${item.tax_id} not found`, 404);
      }
      taxRate = Number(tax.rate);
    }

    const subtotal = Number(item.quantity) * Number(item.unit_price);

    // 3. Compute Item Discount
    let discountAmount = 0;
    const discountVal = Number(item.discount_value || 0);
    if (item.discount_type === 'percentage') {
      discountAmount = subtotal * (discountVal / 100);
    } else {
      discountAmount = discountVal;
    }
    if (discountAmount > subtotal) {
      discountAmount = subtotal; // cap discount at subtotal
    }

    // 4. Compute Tax on discounted subtotal
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

// ─── Quotation Business logic ──────────────────────────────────────────────────
export async function createQuotation(data: CreateQuotationDto, userId: number) {
  // 1. Verify Customer
  const customer = await Customer.findByPk(data.customer_id);
  if (!customer) throw new AppError('Customer not found', 404);

  // 2. Verify optional models
  if (data.lead_id) {
    const lead = await Lead.findByPk(data.lead_id);
    if (!lead) throw new AppError('Lead not found', 404);
  }
  if (data.opportunity_id) {
    const opp = await Opportunity.findByPk(data.opportunity_id);
    if (!opp) throw new AppError('Opportunity not found', 404);
  }

  // 3. Calculate Item totals
  const calculatedItems = await calculateLineItems(data.items);

  // 4. Sum up subtotals, item discounts, and item taxes
  const itemsSubtotal = calculatedItems.reduce((acc, item) => acc + item.subtotal, 0);
  const itemsTaxAmount = calculatedItems.reduce((acc, item) => acc + item.tax_amount, 0);
  const itemsDiscountAmount = calculatedItems.reduce((acc, item) => acc + item.discount_amount, 0);

  // 5. Apply Document-level Discount (on the sum of item subtotals)
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

  // Final Total calculation:
  // (Sum of items subtotal) - (Total discount = items discount sum + doc-level discount) + (Items tax sum) + (adjustment)
  const totalDiscount = itemsDiscountAmount + docDiscountAmount;
  const docTotal = itemsSubtotal - totalDiscount + itemsTaxAmount + docAdjustment;
  const finalTotal = Math.max(0, docTotal);

  // Generate sequence code
  const quotationNumber = await generateNextQuotationNumber();

  // Run database transaction to insert atomically
  const result = await sequelize.transaction(async (t) => {
    const quotationPayload = {
      quotation_number: quotationNumber,
      customer_id: data.customer_id,
      lead_id: data.lead_id || null,
      opportunity_id: data.opportunity_id || null,
      subject: data.subject,
      date: data.date,
      expiry_date: data.expiry_date,
      subtotal: Number(itemsSubtotal.toFixed(2)),
      discount_type: data.discount_type || 'percentage',
      discount_value: docDiscountVal,
      discount_amount: Number(docDiscountAmount.toFixed(2)),
      tax_amount: Number(itemsTaxAmount.toFixed(2)),
      adjustment: Number(docAdjustment.toFixed(2)),
      total: Number(finalTotal.toFixed(2)),
      status: data.status || 'draft',
      terms_conditions: data.terms_conditions || null,
      customer_notes: data.customer_notes || null,
      created_by: userId,
    };

    return repo.createQuotation(quotationPayload, calculatedItems, t);
  });

  return repo.findQuotationById(result.id);
}

export async function listQuotations(filters: QuotationFilters) {
  return repo.listQuotations(filters);
}

export async function getQuotationByUuid(uuid: string) {
  const quotation = await repo.findQuotationByUuid(uuid);
  if (!quotation) throw new AppError('Quotation not found', 404);
  return quotation;
}

export async function updateQuotation(uuid: string, data: UpdateQuotationDto) {
  const quotation = await repo.findQuotationByUuid(uuid);
  if (!quotation) throw new AppError('Quotation not found', 404);

  // If status is finalized (e.g. accepted, declined), validate workflow transitions if required
  // Here we allow edits but calculate values if items are provided

  let calculatedItems: CalculatedItem[] | undefined = undefined;
  let itemsSubtotal = Number(quotation.subtotal);
  let itemsTaxAmount = Number(quotation.tax_amount);
  let itemsDiscountAmount = Number(quotation.items?.reduce((acc: number, i: any) => acc + Number(i.discount_amount), 0) || 0);

  if (data.items !== undefined) {
    calculatedItems = await calculateLineItems(data.items);
    itemsSubtotal = calculatedItems.reduce((acc, item) => acc + item.subtotal, 0);
    itemsTaxAmount = calculatedItems.reduce((acc, item) => acc + item.tax_amount, 0);
    itemsDiscountAmount = calculatedItems.reduce((acc, item) => acc + item.discount_amount, 0);
  }

  // Determine doc-level discount
  const discountType = data.discount_type ?? quotation.discount_type;
  const discountValue = data.discount_value !== undefined ? Number(data.discount_value) : Number(quotation.discount_value);

  let docDiscountAmount = 0;
  if (discountType === 'percentage') {
    docDiscountAmount = itemsSubtotal * (discountValue / 100);
  } else {
    docDiscountAmount = discountValue;
  }
  if (docDiscountAmount > itemsSubtotal) {
    docDiscountAmount = itemsSubtotal;
  }

  const adjustment = data.adjustment !== undefined ? Number(data.adjustment) : Number(quotation.adjustment);

  const totalDiscount = itemsDiscountAmount + docDiscountAmount;
  const docTotal = itemsSubtotal - totalDiscount + itemsTaxAmount + adjustment;
  const finalTotal = Math.max(0, docTotal);

  await sequelize.transaction(async (t) => {
    const quotationPayload = {
      customer_id: data.customer_id ?? quotation.customer_id,
      lead_id: data.lead_id !== undefined ? (data.lead_id || null) : quotation.lead_id,
      opportunity_id: data.opportunity_id !== undefined ? (data.opportunity_id || null) : quotation.opportunity_id,
      subject: data.subject ?? quotation.subject,
      date: data.date ?? quotation.date,
      expiry_date: data.expiry_date ?? quotation.expiry_date,
      subtotal: Number(itemsSubtotal.toFixed(2)),
      discount_type: discountType,
      discount_value: discountValue,
      discount_amount: Number(docDiscountAmount.toFixed(2)),
      tax_amount: Number(itemsTaxAmount.toFixed(2)),
      adjustment: Number(adjustment.toFixed(2)),
      total: Number(finalTotal.toFixed(2)),
      status: data.status ?? quotation.status,
      terms_conditions: data.terms_conditions !== undefined ? data.terms_conditions : quotation.terms_conditions,
      customer_notes: data.customer_notes !== undefined ? data.customer_notes : quotation.customer_notes,
    };

    await repo.updateQuotation(quotation, quotationPayload, calculatedItems, t);
  });

  return repo.findQuotationById(quotation.id);
}

export async function deleteQuotation(uuid: string) {
  const quotation = await repo.findQuotationByUuid(uuid);
  if (!quotation) throw new AppError('Quotation not found', 404);
  await repo.deleteQuotation(quotation);
}
