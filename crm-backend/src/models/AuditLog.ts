import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class AuditLog extends Model {
  declare id: number;
  declare uuid: string;
  declare user_id: number | null;
  declare module: string;
  declare action: string;
  declare entity_type: string;
  declare entity_id: number | null;
  declare old_values: Record<string, any> | null;
  declare new_values: Record<string, any> | null;
  declare ip_address: string | null;
  declare user?: any;
  declare readonly created_at: Date;
}

export function initAuditLog(sequelize: Sequelize) {
  AuditLog.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    module: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    old_values: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    new_values: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'audit_logs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // Audit logs are immutable, no updated_at
    hooks: {
      beforeValidate: (log: AuditLog) => {
        if (!log.uuid) {
          log.uuid = randomUUID();
        }
      }
    }
  });
}
