import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class ProductBrand extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare logo_url: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initProductBrand(sequelize: Sequelize) {
  ProductBrand.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    logo_url: { type: DataTypes.STRING(500), allowNull: true },
  }, {
    sequelize, tableName: 'product_brands', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (b: ProductBrand) => { if (!b.uuid) b.uuid = randomUUID(); } },
  });
}
