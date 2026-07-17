'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('uploaded_files', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      original_name: { type: Sequelize.STRING(255), allowNull: false },
      storage_name: { type: Sequelize.STRING(255), allowNull: false },
      file_path: { type: Sequelize.STRING(500), allowNull: false },
      file_size: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      mime_type: { type: Sequelize.STRING(100), allowNull: false },
      uploaded_by: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // Indexes
    await queryInterface.addIndex('uploaded_files', ['uploaded_by'], { name: 'idx_uploaded_files_uploaded_by' });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('uploaded_files', 'idx_uploaded_files_uploaded_by');
    await queryInterface.dropTable('uploaded_files');
  },
};
