import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class Task extends Model {
  declare id: number;
  declare uuid: string;
  declare title: string;
  declare description: string | null;
  declare status: 'todo' | 'in_progress' | 'completed' | 'deferred';
  declare priority: 'low' | 'medium' | 'high' | 'critical';
  declare due_date: string | null;
  declare assigned_to: number | null;
  declare customer_id: number | null;
  declare lead_id: number | null;
  declare opportunity_id: number | null;
  declare created_by: number;

  // Associations typing
  declare assignee?: any;
  declare customer?: any;
  declare lead?: any;
  declare opportunity?: any;
  declare creator?: any;
  declare comments?: any[];
  declare attachments?: any[];

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initTask(sequelize: Sequelize) {
  Task.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('todo', 'in_progress', 'completed', 'deferred'), allowNull: false, defaultValue: 'todo' },
    priority: { type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), allowNull: false, defaultValue: 'medium' },
    due_date: { type: DataTypes.DATEONLY, allowNull: true },
    assigned_to: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    lead_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    opportunity_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, {
    sequelize, tableName: 'tasks', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (t: Task) => { if (!t.uuid) t.uuid = randomUUID(); } },
  });
}
