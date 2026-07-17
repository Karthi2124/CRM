import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Payment extends Model {
  declare id: number;
  declare uuid: string;
  declare invoice_id: number;
  declare payment_number: string;
  declare amount: number;
  declare payment_date: string;
  declare payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'cheque' | 'paypal' | 'other';
  declare transaction_reference: string | null;
  declare notes: string | null;
  declare created_by: number;

  // Associations typing
  declare invoice?: any;
  declare creator?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initPayment(sequelize: Sequelize) {
  Payment.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    invoice_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    payment_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    payment_date: { type: DataTypes.DATEONLY, allowNull: false },
    payment_method: { type: DataTypes.ENUM('cash', 'bank_transfer', 'credit_card', 'cheque', 'paypal', 'other'), allowNull: false, defaultValue: 'bank_transfer' },
    transaction_reference: { type: DataTypes.STRING(100), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, {
    sequelize, tableName: 'payments', underscored: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at',
    hooks: { beforeValidate: (p: Payment) => { if (!p.uuid) p.uuid = randomUUID(); } },
  });
}
