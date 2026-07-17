'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Notification Templates Table
    await queryInterface.createTable('notification_templates', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      subject_template: { type: Sequelize.STRING(255), allowNull: false },
      body_template: { type: Sequelize.TEXT, allowNull: false },
      channels: { type: Sequelize.JSON, allowNull: false }, // Array of strings like ["in_app", "email"]
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // 2. Notifications Table
    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      recipient_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      title: { type: Sequelize.STRING(255), allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      type: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'info' }, // e.g. info, warning, success, error
      is_read: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      read_at: { type: Sequelize.DATE, allowNull: true },
      related_entity_type: { type: Sequelize.STRING(50), allowNull: true }, // e.g. lead, customer, opportunity, invoice
      related_entity_id: { type: Sequelize.STRING(255), allowNull: true }, // UUID of linked entity
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // 3. Notification Preferences Table
    await queryInterface.createTable('notification_preferences', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      notification_type: { type: Sequelize.STRING(100), allowNull: false }, // Template name e.g. lead_assigned
      email: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      in_app: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      sms: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Indexes
    await queryInterface.addIndex('notifications', ['recipient_id'], { name: 'idx_notifications_recipient_id' });
    await queryInterface.addIndex('notifications', ['is_read'], { name: 'idx_notifications_is_read' });
    await queryInterface.addIndex('notification_preferences', ['user_id'], { name: 'idx_notif_prefs_user_id' });
    await queryInterface.addIndex('notification_preferences', ['user_id', 'notification_type'], {
      name: 'idx_notif_prefs_user_type',
      unique: true,
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('notification_preferences', 'idx_notif_prefs_user_type');
    await queryInterface.removeIndex('notification_preferences', 'idx_notif_prefs_user_id');
    await queryInterface.removeIndex('notifications', 'idx_notifications_is_read');
    await queryInterface.removeIndex('notifications', 'idx_notifications_recipient_id');
    await queryInterface.dropTable('notification_preferences');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('notification_templates');
  },
};
