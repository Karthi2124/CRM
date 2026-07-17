import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Setting extends Model {
  declare id: number;
  declare uuid: string;
  declare key: string;
  declare value: string | null;
  declare group: string;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initSetting(sequelize: Sequelize) {
  Setting.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    value: { type: DataTypes.TEXT, allowNull: true },
    group: { type: DataTypes.STRING(50), allowNull: false },
  }, {
    sequelize, tableName: 'settings', underscored: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at',
    hooks: { beforeValidate: (setting: Setting) => { if (!setting.uuid) setting.uuid = randomUUID(); } },
  });
}
