import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Notification extends Model {
  declare id: number;
  declare uuid: string;
  declare recipient_id: number;
  declare title: string;
  declare message: string;
  declare type: string; // info, warning, success, error
  declare is_read: boolean;
  declare read_at: Date | null;
  declare related_entity_type: string | null;
  declare related_entity_id: string | null;

  // Associations typing
  declare recipient?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initNotification(sequelize: Sequelize) {
  Notification.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    recipient_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'info' },
    is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    read_at: { type: DataTypes.DATE, allowNull: true },
    related_entity_type: { type: DataTypes.STRING(50), allowNull: true },
    related_entity_id: { type: DataTypes.STRING(255), allowNull: true },
  }, {
    sequelize, tableName: 'notifications', underscored: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at',
    hooks: { beforeValidate: (n: Notification) => { if (!n.uuid) n.uuid = randomUUID(); } },
  });
}
