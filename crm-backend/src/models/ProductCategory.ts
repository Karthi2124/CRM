import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class ProductCategory extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare description: string | null;
  declare parent_id: number | null;
  declare parent?: any;
  declare children?: any[];
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initProductCategory(sequelize: Sequelize) {
  ProductCategory.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255), allowNull: true },
    parent_id: {
      type: DataTypes.INTEGER.UNSIGNED, allowNull: true,
      references: { model: 'product_categories', key: 'id' },
    },
  }, {
    sequelize, tableName: 'product_categories', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (c: ProductCategory) => { if (!c.uuid) c.uuid = randomUUID(); } },
  });
}
