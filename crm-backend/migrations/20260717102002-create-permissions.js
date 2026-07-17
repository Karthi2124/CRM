'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      module: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add Indexes
    await queryInterface.addIndex('permissions', ['uuid'], {
      unique: true,
      name: 'idx_permissions_uuid',
    });
    await queryInterface.addIndex('permissions', ['module', 'action'], {
      unique: true,
      name: 'idx_permissions_module_action',
    });
    await queryInterface.addIndex('permissions', ['deleted_at'], {
      name: 'idx_permissions_deleted_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permissions');
  }
};
