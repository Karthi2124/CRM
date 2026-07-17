import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class OpportunityCompetitor extends Model {
  declare id: number;
  declare uuid: string;
  declare opportunity_id: number;
  declare competitor_name: string;
  declare strength: string | null;
  declare weakness: string | null;
  declare opportunity?: any;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initOpportunityCompetitor(sequelize: Sequelize) {
  OpportunityCompetitor.init({
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
    opportunity_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'opportunities',
        key: 'id',
      },
    },
    competitor_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    strength: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    weakness: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'opportunity_competitors',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (comp: OpportunityCompetitor) => {
        if (!comp.uuid) {
          comp.uuid = randomUUID();
        }
      }
    }
  });
}
