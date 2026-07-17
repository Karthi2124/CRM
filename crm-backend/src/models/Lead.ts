import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Lead extends Model {
  declare id: number;
  declare uuid: string;
  declare first_name: string;
  declare last_name: string;
  declare company_name: string | null;
  declare email: string | null;
  declare phone: string | null;
  declare source: string;
  declare status: string;
  declare value: number | null;
  declare assigned_to: number | null;
  declare created_by: number | null;
  declare assignee?: any;
  declare creator?: any;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initLead(sequelize: Sequelize) {
  Lead.init({
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
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING(150),
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
    source: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'manual',
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'new',
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    assigned_to: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
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
    tableName: 'leads',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (lead: Lead) => {
        if (!lead.uuid) {
          lead.uuid = randomUUID();
        }
      }
    }
  });
}
