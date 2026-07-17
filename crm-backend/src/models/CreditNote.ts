import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class CreditNote extends Model {
  declare id: number;
  declare uuid: string;
  declare credit_note_number: string;
  declare invoice_id: number;
  declare amount: number;
  declare credit_note_date: string;
  declare reason: string;
  declare status: 'draft' | 'applied' | 'voided';
  declare created_by: number;

  // Associations typing
  declare invoice?: any;
  declare creator?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initCreditNote(sequelize: Sequelize) {
  CreditNote.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    credit_note_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    invoice_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    credit_note_date: { type: DataTypes.DATEONLY, allowNull: false },
    reason: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.ENUM('draft', 'applied', 'voided'), allowNull: false, defaultValue: 'draft' },
    created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, {
    sequelize, tableName: 'credit_notes', underscored: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at',
    hooks: { beforeValidate: (cn: CreditNote) => { if (!cn.uuid) cn.uuid = randomUUID(); } },
  });
}
