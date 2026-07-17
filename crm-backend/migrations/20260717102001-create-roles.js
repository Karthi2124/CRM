'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
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
      name: {
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
    await queryInterface.addIndex('roles', ['uuid'], {
      unique: true,
      name: 'idx_roles_uuid',
    });
    await queryInterface.addIndex('roles', ['name'], {
      unique: true,
      name: 'idx_roles_name',
    });
    await queryInterface.addIndex('roles', ['deleted_at'], {
      name: 'idx_roles_deleted_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('roles');
  }
};
