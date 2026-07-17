import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class OpportunityStage extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare probability: number;
  declare order: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initOpportunityStage(sequelize: Sequelize) {
  OpportunityStage.init({
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
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    probability: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 10,
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    sequelize,
    tableName: 'opportunity_stages',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (stage: OpportunityStage) => {
        if (!stage.uuid) {
          stage.uuid = randomUUID();
        }
      }
    }
  });
}
