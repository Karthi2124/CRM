import { Model, DataTypes, Sequelize } from 'sequelize';
import { randomUUID } from 'crypto';

export class UploadedFile extends Model {
  declare id: number;
  declare uuid: string;
  declare original_name: string;
  declare storage_name: string;
  declare file_path: string;
  declare file_size: number;
  declare mime_type: string;
  declare uploaded_by: number | null;

  // Associations typing
  declare uploader?: any;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date | null;
}

export function initUploadedFile(sequelize: Sequelize) {
  UploadedFile.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    original_name: { type: DataTypes.STRING(255), allowNull: false },
    storage_name: { type: DataTypes.STRING(255), allowNull: false },
    file_path: { type: DataTypes.STRING(500), allowNull: false },
    file_size: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    mime_type: { type: DataTypes.STRING(100), allowNull: false },
    uploaded_by: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  }, {
    sequelize, tableName: 'uploaded_files', underscored: true, paranoid: true,
    timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', deletedAt: 'deleted_at',
    hooks: { beforeValidate: (uf: UploadedFile) => { if (!uf.uuid) uf.uuid = randomUUID(); } },
  });
}
