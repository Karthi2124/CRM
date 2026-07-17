import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Role extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare description: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initRole(sequelize: Sequelize) {
  Role.init({
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'roles',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (role: Role) => {
        if (!role.uuid) {
          role.uuid = randomUUID();
        }
      }
    }
  });
}
