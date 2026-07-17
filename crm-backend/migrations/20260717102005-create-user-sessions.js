'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_sessions', {
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
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      jwt_token: {
        type: Sequelize.VARCHAR ? Sequelize.VARCHAR(1024) : Sequelize.STRING(1024),
        allowNull: false,
      },
      refresh_token: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      login_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      logout_at: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex('user_sessions', ['uuid'], {
      unique: true,
      name: 'idx_user_sessions_uuid',
    });
    await queryInterface.addIndex('user_sessions', ['refresh_token'], {
      unique: true,
      name: 'idx_user_sessions_refresh_token',
    });
    await queryInterface.addIndex('user_sessions', ['user_id'], {
      name: 'idx_user_sessions_user_id',
    });
    await queryInterface.addIndex('user_sessions', ['deleted_at'], {
      name: 'idx_user_sessions_deleted_at',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_sessions');
  }
};
