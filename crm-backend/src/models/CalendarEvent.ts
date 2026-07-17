import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class CalendarEvent extends Model {
  declare id: number;
  declare uuid: string;
  declare title: string;
  declare description: string | null;
  declare start_date: Date;
  declare end_date: Date;
  declare location: string | null;
  declare is_all_day: boolean;
  declare meeting_link: string | null;
  declare status: 'scheduled' | 'cancelled' | 'completed';
  declare customer_id: number | null;
  declare lead_id: number | null;
  declare opportunity_id: number | null;
  declare assigned_to: number | null;
  declare created_by: number;
  declare google_event_id: string | null;
  declare outlook_event_id: string | null;
  declare sync_status: 'synced' | 'pending' | 'failed' | 'none';

  // Associations typing
  declare customer?: any;
  declare lead?: any;
  declare opportunity?: any;
  declare assignee?: any;
  declare creator?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initCalendarEvent(sequelize: Sequelize) {
  CalendarEvent.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING(255), allowNull: true },
    is_all_day: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    meeting_link: { type: DataTypes.STRING(500), allowNull: true },
    status: { type: DataTypes.ENUM('scheduled', 'cancelled', 'completed'), allowNull: false, defaultValue: 'scheduled' },
    customer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    lead_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    opportunity_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    assigned_to: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    created_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    google_event_id: { type: DataTypes.STRING(255), allowNull: true },
    outlook_event_id: { type: DataTypes.STRING(255), allowNull: true },
    sync_status: { type: DataTypes.ENUM('synced', 'pending', 'failed', 'none'), allowNull: false, defaultValue: 'none' },
  }, {
    sequelize, tableName: 'calendar_events', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (ce: CalendarEvent) => { if (!ce.uuid) ce.uuid = randomUUID(); } },
  });
}
