import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class ProductUnit extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare symbol: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initProductUnit(sequelize: Sequelize) {
  ProductUnit.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    symbol: { type: DataTypes.STRING(10), allowNull: true },
  }, {
    sequelize, tableName: 'product_units', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (u: ProductUnit) => { if (!u.uuid) u.uuid = randomUUID(); } },
  });
}
