import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Invoice extends Model {
  declare id: number;
  declare uuid: string;
  declare invoice_number: string;
  declare customer_id: number;
  declare quotation_id: number | null;
  declare subject: string;
  declare date: string;
  declare due_date: string;
  declare subtotal: number;
  declare discount_type: 'percentage' | 'fixed';
  declare discount_value: number;
  declare discount_amount: number;
  declare tax_amount: number;
  declare adjustment: number;
  declare total: number;
  declare amount_paid: number;
  declare balance_due: number;
  declare status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'unpaid' | 'voided';
  declare terms_conditions: string | null;
  declare customer_notes: string | null;
  declare created_by: number;

  // Associations typing
  declare customer?: any;
  declare quotation?: any;
  declare items?: any[];
  declare payments?: any[];
  declare creditNotes?: any[];
  declare creator?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initInvoice(sequelize: Sequelize) {
  Invoice.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    invoice_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    quotation_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    subject: { type: DataTypes.STRING(255), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    due_date: { type: DataTypes.DATEONLY, allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    discount_type: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: false, defaultValue: 'percentage' },
    discount_value: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    discount_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    tax_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    adjustment: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    total: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    amount_paid: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    balance_due: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    status: { type: DataTypes.ENUM('draft', 'sent', 'partially_paid', 'paid', 'unpaid', 'voided'), allowNull: false, defaultValue: 'draft' },
    terms_conditions: { type: DataTypes.TEXT, allowNull: true },
    customer_notes: { type: DataTypes.TEXT, allowNull: true },
    created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, {
    sequelize, tableName: 'invoices', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (i: Invoice) => { if (!i.uuid) i.uuid = randomUUID(); } },
  });
}
