import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Company extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare legal_name: string | null;
  declare email: string | null;
  declare phone: string | null;
  declare website: string | null;
  declare tax_number: string | null;
  declare logo_url: string | null;
  declare address: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initCompany(sequelize: Sequelize) {
  Company.init({
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
    legal_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tax_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'companies',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (company: Company) => {
        if (!company.uuid) {
          company.uuid = randomUUID();
        }
      }
    }
  });
}
