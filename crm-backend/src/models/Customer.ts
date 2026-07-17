import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Customer extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare type: 'company' | 'individual';
  declare email: string | null;
  declare phone: string | null;
  declare website: string | null;
  declare gst_number: string | null;
  declare tax_id: string | null;
  declare status: 'active' | 'inactive';
  declare created_by: number | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initCustomer(sequelize: Sequelize) {
  Customer.init({
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
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('company', 'individual'),
      allowNull: false,
      defaultValue: 'company',
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    gst_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    tableName: 'customers',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (customer: Customer) => {
        if (!customer.uuid) {
          customer.uuid = randomUUID();
        }
      }
    }
  });
}
