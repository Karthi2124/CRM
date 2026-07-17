import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class NotificationTemplate extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare subject_template: string;
  declare body_template: string;
  declare channels: string[]; // parsed from JSON

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initNotificationTemplate(sequelize: Sequelize) {
  NotificationTemplate.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    subject_template: { type: DataTypes.STRING(255), allowNull: false },
    body_template: { type: DataTypes.TEXT, allowNull: false },
    channels: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: ['in_app'],
    },
  }, {
    sequelize, tableName: 'notification_templates', underscored: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at',
    hooks: { beforeValidate: (nt: NotificationTemplate) => { if (!nt.uuid) nt.uuid = randomUUID(); } },
  });
}
