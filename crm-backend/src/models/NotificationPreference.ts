import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class NotificationPreference extends Model {
  declare id: number;
  declare uuid: string;
  declare user_id: number;
  declare notification_type: string; // e.g. lead_assigned
  declare email: boolean;
  declare in_app: boolean;
  declare sms: boolean;

  // Associations typing
  declare user?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initNotificationPreference(sequelize: Sequelize) {
  NotificationPreference.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    notification_type: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    in_app: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    sms: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  }, {
    sequelize, tableName: 'notification_preferences', underscored: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at',
    hooks: { beforeValidate: (np: NotificationPreference) => { if (!np.uuid) np.uuid = randomUUID(); } },
  });
}
