import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Tax extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare rate: number;
  declare type: 'percentage' | 'fixed';
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initTax(sequelize: Sequelize) {
  Tax.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    rate: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    type: { type: DataTypes.ENUM('percentage', 'fixed'), allowNull: false, defaultValue: 'percentage' },
  }, {
    sequelize, tableName: 'taxes', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (t: Tax) => { if (!t.uuid) t.uuid = randomUUID(); } },
  });
}
