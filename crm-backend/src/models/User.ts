import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class User extends Model {
  declare id: number;
  declare uuid: string;
  declare employee_id: string | null;
  declare first_name: string;
  declare last_name: string;
  declare email: string;
  declare phone: string | null;
  declare avatar_url: string | null;
  declare address: string | null;
  declare date_of_birth: string | null;
  declare gender: 'male' | 'female' | 'other' | null;
  declare password_hash: string;
  declare role_id: number;
  declare status: 'active' | 'inactive' | 'suspended';
  declare last_login_at: Date | null;
  declare password_reset_token: string | null;
  declare password_reset_expires_at: Date | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initUser(sequelize: Sequelize) {
  User.init({
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
    employee_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active',
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password_reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password_reset_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'users',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (user: User) => {
        if (!user.uuid) {
          user.uuid = randomUUID();
        }
      }
    }
  });
}
