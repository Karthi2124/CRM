import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class CustomerContact extends Model {
  declare id: number;
  declare uuid: string;
  declare customer_id: number;
  declare first_name: string;
  declare last_name: string;
  declare email: string | null;
  declare phone: string | null;
  declare designation: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initCustomerContact(sequelize: Sequelize) {
  CustomerContact.init({
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
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'customer_contacts',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (contact: CustomerContact) => {
        if (!contact.uuid) {
          contact.uuid = randomUUID();
        }
      }
    }
  });
}
