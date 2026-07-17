import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Permission extends Model {
  declare id: number;
  declare uuid: string;
  declare module: string;
  declare action: string;
  declare description: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initPermission(sequelize: Sequelize) {
  Permission.init({
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
    module: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'permissions',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
      {
        unique: true,
        fields: ['module', 'action'],
        name: 'idx_permissions_module_action',
      }
    ],
    hooks: {
      beforeValidate: (permission: Permission) => {
        if (!permission.uuid) {
          permission.uuid = randomUUID();
        }
      }
    }
  });
}
