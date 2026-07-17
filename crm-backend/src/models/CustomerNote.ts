import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class CustomerNote extends Model {
  declare id: number;
  declare uuid: string;
  declare customer_id: number;
  declare user_id: number | null;
  declare note: string;
  declare author?: any;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initCustomerNote(sequelize: Sequelize) {
  CustomerNote.init({
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
    customer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'customers',
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
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'customer_notes',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (note: CustomerNote) => {
        if (!note.uuid) {
          note.uuid = randomUUID();
        }
      }
    }
  });
}
