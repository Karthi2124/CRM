'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('audit_logs', {
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
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Retain audit log but set user to null if user is hard deleted
      },
      module: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      old_values: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      new_values: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add Indexes
    await queryInterface.addIndex('audit_logs', ['uuid'], {
      unique: true,
      name: 'idx_audit_logs_uuid',
    });
    await queryInterface.addIndex('audit_logs', ['user_id'], {
      name: 'idx_audit_logs_user_id',
    });
    await queryInterface.addIndex('audit_logs', ['entity_type', 'entity_id'], {
      name: 'idx_audit_logs_entity',
    });
    await queryInterface.addIndex('audit_logs', ['created_at'], {
      name: 'idx_audit_logs_created_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
  }
};
