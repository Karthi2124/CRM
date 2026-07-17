import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class PriceList extends Model {
  declare id: number;
  declare uuid: string;
  declare product_id: number;
  declare name: string;
  declare price: number;
  declare min_quantity: number;
  declare valid_from: Date | null;
  declare valid_to: Date | null;
  declare product?: any;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initPriceList(sequelize: Sequelize) {
  PriceList.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    product_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: false },
    price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    min_quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
    valid_from: { type: DataTypes.DATE, allowNull: true },
    valid_to: { type: DataTypes.DATE, allowNull: true },
  }, {
    sequelize, tableName: 'price_lists', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (pl: PriceList) => { if (!pl.uuid) pl.uuid = randomUUID(); } },
  });
}
