import { Model, DataTypes, Sequelize } from 'sequelize';

export class RolePermission extends Model {
  declare role_id: number;
  declare permission_id: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initRolePermission(sequelize: Sequelize) {
  RolePermission.init({
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    permission_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: 'permissions',
        key: 'id',
      },
    },
  }, {
    sequelize,
    tableName: 'role_permissions',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
}
