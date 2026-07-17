import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class TaskAttachment extends Model {
  declare id: number;
  declare uuid: string;
  declare task_id: number;
  declare file_name: string;
  declare file_url: string;
  declare file_size: number | null;
  declare mime_type: string | null;
  declare uploaded_by: number | null;

  // Associations typing
  declare task?: any;
  declare uploader?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

export function initTaskAttachment(sequelize: Sequelize) {
  TaskAttachment.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    task_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    file_name: { type: DataTypes.STRING(255), allowNull: false },
    file_url: { type: DataTypes.STRING(500), allowNull: false },
    file_size: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    mime_type: { type: DataTypes.STRING(100), allowNull: true },
    uploaded_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, {
    sequelize, tableName: 'task_attachments', underscored: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at',
    hooks: { beforeValidate: (ta: TaskAttachment) => { if (!ta.uuid) ta.uuid = randomUUID(); } },
  });
}
