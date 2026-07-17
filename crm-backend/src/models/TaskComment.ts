import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class TaskComment extends Model {
  declare id: number;
  declare uuid: string;
  declare task_id: number;
  declare comment: string;
  declare user_id: number | null;

  // Associations typing
  declare task?: any;
  declare author?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initTaskComment(sequelize: Sequelize) {
  TaskComment.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    task_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, {
    sequelize, tableName: 'task_comments', underscored: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at',
    hooks: { beforeValidate: (tc: TaskComment) => { if (!tc.uuid) tc.uuid = randomUUID(); } },
  });
}
