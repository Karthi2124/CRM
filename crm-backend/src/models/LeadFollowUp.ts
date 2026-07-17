import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class LeadFollowUp extends Model {
  declare id: number;
  declare uuid: string;
  declare lead_id: number;
  declare user_id: number | null;
  declare followup_date: Date;
  declare remarks: string | null;
  declare status: 'pending' | 'completed' | 'cancelled';
  declare author?: any;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initLeadFollowUp(sequelize: Sequelize) {
  LeadFollowUp.init({
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
    followup_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    tableName: 'lead_followups',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (followup: LeadFollowUp) => {
        if (!followup.uuid) {
          followup.uuid = randomUUID();
        }
      }
    }
  });
}
