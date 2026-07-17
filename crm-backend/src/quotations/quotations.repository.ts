import { Op, Transaction } from 'sequelize';
import {
  Quotation, QuotationItem, Customer, Lead, Opportunity, User, Product, Tax,
} from '../models';
import { QuotationFilters } from './quotations.types';

const defaultIncludes = [
  { model: Customer, as: 'customer', attributes: ['id', 'uuid', 'first_name', 'last_name', 'company_name', 'email'] },
  { model: Lead, as: 'lead', attributes: ['id', 'uuid', 'first_name', 'last_name', 'company'] },
  { model: Opportunity, as: 'opportunity', attributes: ['id', 'uuid', 'name', 'value'] },
  { model: User, as: 'creator', attributes: ['id', 'uuid', 'first_name', 'last_name', 'email'] },
  {
    model: QuotationItem,
    as: 'items',
    include: [
      { model: Product, as: 'product', attributes: ['id', 'uuid', 'name', 'sku'] },
      { model: Tax, as: 'tax', attributes: ['id', 'uuid', 'name', 'rate', 'type'] },
    ],
  },
];

export async function createQuotation(data: any, items: any[], transaction: Transaction) {
  const quotation = await Quotation.create(data, { transaction });

  const itemsToCreate = items.map((item) => ({
    ...item,
    quotation_id: quotation.id,
  }));

  await QuotationItem.bulkCreate(itemsToCreate, { transaction });

  return quotation;
}

export async function findQuotationByUuid(uuid: string) {
  return Quotation.findOne({
    where: { uuid },
    include: defaultIncludes,
  });
}

export async function findQuotationById(id: number) {
  return Quotation.findByPk(id, {
    include: defaultIncludes,
  });
}

export async function listQuotations(filters: QuotationFilters) {
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
  if (filters.lead_id) {
    where.lead_id = filters.lead_id;
  }
  if (filters.opportunity_id) {
    where.opportunity_id = filters.opportunity_id;
  }

  if (filters.search) {
    where[Op.or] = [
      { quotation_number: { [Op.like]: `%${filters.search}%` } },
      { subject: { [Op.like]: `%${filters.search}%` } },
    ];
  }

  const { count, rows } = await Quotation.findAndCountAll({
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

export async function updateQuotation(
  quotation: Quotation,
  data: any,
  items: any[] | undefined,
  transaction: Transaction
) {
  await quotation.update(data, { transaction });

  if (items !== undefined) {
    // Replace all items atomically inside the transaction
    await QuotationItem.destroy({
      where: { quotation_id: quotation.id },
      transaction,
    });

    const itemsToCreate = items.map((item) => ({
      ...item,
      quotation_id: quotation.id,
    }));

    await QuotationItem.bulkCreate(itemsToCreate, { transaction });
  }

  return quotation;
}

export async function deleteQuotation(quotation: Quotation) {
  return quotation.destroy();
}

/**
 * Returns the highest sequence number for quotations created in the current year
 */
export async function getLatestQuotationNumber(yearPrefix: string): Promise<string | null> {
  const latest = await Quotation.findOne({
    where: {
      quotation_number: {
        [Op.like]: `QT-${yearPrefix}-%`,
      },
    },
    order: [['id', 'DESC']],
    paranoid: false, // Include soft-deleted entries to prevent duplication of quotation numbers
  });

  return latest ? latest.quotation_number : null;
}
