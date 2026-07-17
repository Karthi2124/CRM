import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class LeadActivity extends Model {
  declare id: number;
  declare uuid: string;
  declare lead_id: number;
  declare user_id: number | null;
  declare type: 'call' | 'email' | 'meeting' | 'task';
  declare details: string;
  declare activity_date: Date;
  declare author?: any;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initLeadActivity(sequelize: Sequelize) {
  LeadActivity.init({
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
    lead_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'leads',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('call', 'email', 'meeting', 'task'),
      allowNull: false,
      defaultValue: 'call',
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    activity_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'lead_activities',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (activity: LeadActivity) => {
        if (!activity.uuid) {
          activity.uuid = randomUUID();
        }
      }
    }
  });
}
