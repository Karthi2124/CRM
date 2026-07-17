import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class CustomerAddress extends Model {
  declare id: number;
  declare uuid: string;
  declare customer_id: number;
  declare type: 'billing' | 'shipping';
  declare address_line_1: string;
  declare address_line_2: string | null;
  declare city: string;
  declare state: string;
  declare country: string;
  declare zip_code: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initCustomerAddress(sequelize: Sequelize) {
  CustomerAddress.init({
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
    customer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('billing', 'shipping'),
      allowNull: false,
      defaultValue: 'billing',
    },
    address_line_1: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address_line_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    zip_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'customer_addresses',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (address: CustomerAddress) => {
        if (!address.uuid) {
          address.uuid = randomUUID();
        }
      }
    }
  });
}
