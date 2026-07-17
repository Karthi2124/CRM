import { Op, Transaction } from 'sequelize';
import {
  Invoice, InvoiceItem, Payment, CreditNote, Customer, Quotation, User, Product, Tax,
} from '../models';
import { InvoiceFilters } from './invoices.types';

const defaultIncludes = [
  { model: Customer, as: 'customer', attributes: ['id', 'uuid', 'first_name', 'last_name', 'company_name', 'email'] },
  { model: Quotation, as: 'quotation', attributes: ['id', 'uuid', 'quotation_number'] },
  { model: User, as: 'creator', attributes: ['id', 'uuid', 'first_name', 'last_name', 'email'] },
  {
    model: InvoiceItem,
    as: 'items',
    include: [
      { model: Product, as: 'product', attributes: ['id', 'uuid', 'name', 'sku'] },
      { model: Tax, as: 'tax', attributes: ['id', 'uuid', 'name', 'rate', 'type'] },
    ],
  },
  { model: Payment, as: 'payments', include: [{ model: User, as: 'creator', attributes: ['first_name', 'last_name'] }] },
  { model: CreditNote, as: 'creditNotes', include: [{ model: User, as: 'creator', attributes: ['first_name', 'last_name'] }] },
];

export async function createInvoice(data: any, items: any[], transaction: Transaction) {
  const invoice = await Invoice.create(data, { transaction });

  const itemsToCreate = items.map((item) => ({
    ...item,
    invoice_id: invoice.id,
  }));

  await InvoiceItem.bulkCreate(itemsToCreate, { transaction });

  return invoice;
}

export async function findInvoiceByUuid(uuid: string) {
  return Invoice.findOne({
    where: { uuid },
    include: defaultIncludes,
  });
}

export async function findInvoiceById(id: number) {
  return Invoice.findByPk(id, {
    include: defaultIncludes,
  });
}

export async function listInvoices(filters: InvoiceFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const offset = (page - 1) * limit;

  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.customer_id) {
    where.customer_id = filters.customer_id;
  }
  if (filters.quotation_id) {
    where.quotation_id = filters.quotation_id;
  }

  if (filters.search) {
    where[Op.or] = [
      { invoice_number: { [Op.like]: `%${filters.search}%` } },
      { subject: { [Op.like]: `%${filters.search}%` } },
    ];
  }

  const { count, rows } = await Invoice.findAndCountAll({
    where,
    include: [
      { model: Customer, as: 'customer', attributes: ['id', 'uuid', 'first_name', 'last_name', 'company_name'] },
      { model: User, as: 'creator', attributes: ['id', 'uuid', 'first_name', 'last_name'] },
    ],
    limit,
    offset,
    order: [['created_at', 'DESC']],
    distinct: true,
  });

  return {
    data: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function updateInvoice(
  invoice: Invoice,
  data: any,
  items: any[] | undefined,
  transaction: Transaction
) {
  await invoice.update(data, { transaction });

  if (items !== undefined) {
    await InvoiceItem.destroy({
      where: { invoice_id: invoice.id },
      transaction,
    });

    const itemsToCreate = items.map((item) => ({
      ...item,
      invoice_id: invoice.id,
    }));

    await InvoiceItem.bulkCreate(itemsToCreate, { transaction });
  }

  return invoice;
}

export async function deleteInvoice(invoice: Invoice) {
  return invoice.destroy();
}

export async function getLatestInvoiceNumber(yearPrefix: string): Promise<string | null> {
  const latest = await Invoice.findOne({
    where: {
      invoice_number: {
        [Op.like]: `INV-${yearPrefix}-%`,
      },
    },
    order: [['id', 'DESC']],
    paranoid: false,
  });

  return latest ? latest.invoice_number : null;
}

// ─── Payment Operations ──────────────────────────────────────────────────────────

export async function createPayment(data: any, transaction: Transaction) {
  return Payment.create(data, { transaction });
}

export async function listPaymentsForInvoice(invoiceId: number) {
  return Payment.findAll({
    where: { invoice_id: invoiceId },
    order: [['payment_date', 'DESC']],
  });
}

export async function getLatestPaymentNumber(yearPrefix: string): Promise<string | null> {
  const latest = await Payment.findOne({
    where: {
      payment_number: {
        [Op.like]: `PAY-${yearPrefix}-%`,
      },
    },
    order: [['id', 'DESC']],
  });

  return latest ? latest.payment_number : null;
}

// ─── Credit Note Operations ──────────────────────────────────────────────────────

export async function createCreditNote(data: any, transaction: Transaction) {
  return CreditNote.create(data, { transaction });
}

export async function listCreditNotesForInvoice(invoiceId: number) {
  return CreditNote.findAll({
    where: { invoice_id: invoiceId },
    order: [['credit_note_date', 'DESC']],
  });
}

export async function getLatestCreditNoteNumber(yearPrefix: string): Promise<string | null> {
  const latest = await CreditNote.findOne({
    where: {
      credit_note_number: {
        [Op.like]: `CRN-${yearPrefix}-%`,
      },
    },
    order: [['id', 'DESC']],
  });

  return latest ? latest.credit_note_number : null;
}
