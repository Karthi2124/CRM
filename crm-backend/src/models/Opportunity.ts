import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Opportunity extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare customer_id: number;
  declare lead_id: number | null;
  declare stage_id: number;
  declare value: number;
  declare probability: number;
  declare expected_revenue: number;
  declare close_date: Date | null;
  declare assigned_to: number | null;
  declare created_by: number | null;
  declare lost_reason: string | null;
  declare win_reason: string | null;
  declare assignee?: any;
  declare creator?: any;
  declare stage?: any;
  declare customer?: any;
  declare lead?: any;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initOpportunity(sequelize: Sequelize) {
  Opportunity.init({
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
    customer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    lead_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'leads',
        key: 'id',
      },
    },
    stage_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'opportunity_stages',
        key: 'id',
      },
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    probability: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 10,
    },
    expected_revenue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    close_date: {
      type: DataTypes.DATE,
      allowNull: true,
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
    lost_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    win_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'opportunities',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (opp: Opportunity) => {
        if (!opp.uuid) {
          opp.uuid = randomUUID();
        }
      }
    }
  });
}
