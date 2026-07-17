import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class InvoiceItem extends Model {
  declare id: number;
  declare uuid: string;
  declare invoice_id: number;
  declare product_id: number | null;
  declare description: string | null;
  declare quantity: number;
  declare unit_price: number;
  declare discount_type: 'percentage' | 'fixed';
  declare discount_value: number;
  declare discount_amount: number;
  declare tax_id: number | null;
  declare tax_rate: number;
  declare tax_amount: number;
  declare subtotal: number;
  declare total: number;

  // Associations typing
  declare product?: any;
  declare tax?: any;
  declare invoice?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initInvoiceItem(sequelize: Sequelize) {
  InvoiceItem.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    invoice_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    quantity: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    discount_type: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: false, defaultValue: 'percentage' },
    discount_value: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    discount_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    tax_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    tax_rate: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0.00 },
    tax_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    subtotal: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    total: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  }, {
    sequelize, tableName: 'invoice_items', underscored: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at',
    hooks: { beforeValidate: (ii: InvoiceItem) => { if (!ii.uuid) ii.uuid = randomUUID(); } },
  });
}
