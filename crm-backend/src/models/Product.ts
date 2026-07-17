import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Product extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare sku: string | null;
  declare description: string | null;
  declare category_id: number | null;
  declare brand_id: number | null;
  declare unit_id: number | null;
  declare tax_id: number | null;
  declare base_price: number;
  declare selling_price: number;
  declare image_url: string | null;
  declare status: 'active' | 'inactive';
  declare category?: any;
  declare brand?: any;
  declare unit?: any;
  declare tax?: any;
  declare priceLists?: any[];
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initProduct(sequelize: Sequelize) {
  Product.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    sku: { type: DataTypes.STRING(100), allowNull: true, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    category_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    brand_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    unit_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    tax_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    base_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    selling_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    image_url: { type: DataTypes.STRING(500), allowNull: true },
    status: { type: DataTypes.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' },
  }, {
    sequelize, tableName: 'products', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (p: Product) => { if (!p.uuid) p.uuid = randomUUID(); } },
  });
}
