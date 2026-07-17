import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class UserSession extends Model {
  declare id: number;
  declare uuid: string;
  declare user_id: number;
  declare jwt_token: string;
  declare refresh_token: string;
  declare ip_address: string | null;
  declare user_agent: string | null;
  declare login_at: Date;
  declare expires_at: Date;
  declare logout_at: Date | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initUserSession(sequelize: Sequelize) {
  UserSession.init({
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
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    jwt_token: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    login_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    logout_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'user_sessions',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    hooks: {
      beforeValidate: (session: UserSession) => {
        if (!session.uuid) {
          session.uuid = randomUUID();
        }
      }
    }
  });
}
