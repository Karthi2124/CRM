'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calendar_events', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      title: { type: Sequelize.STRING(150), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      start_date: { type: Sequelize.DATE, allowNull: false },
      end_date: { type: Sequelize.DATE, allowNull: false },
      location: { type: Sequelize.STRING(255), allowNull: true },
      is_all_day: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      meeting_link: { type: Sequelize.STRING(500), allowNull: true },
      status: {
        type: Sequelize.ENUM('scheduled', 'cancelled', 'completed'),
        allowNull: false, defaultValue: 'scheduled',
      },
      customer_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'customers', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      lead_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'leads', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      opportunity_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'opportunities', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      assigned_to: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_by: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      google_event_id: { type: Sequelize.STRING(255), allowNull: true },
      outlook_event_id: { type: Sequelize.STRING(255), allowNull: true },
      sync_status: {
        type: Sequelize.ENUM('synced', 'pending', 'failed', 'none'),
        allowNull: false, defaultValue: 'none',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // Indexes
    await queryInterface.addIndex('calendar_events', ['customer_id'], { name: 'idx_cal_events_customer_id' });
    await queryInterface.addIndex('calendar_events', ['lead_id'], { name: 'idx_cal_events_lead_id' });
    await queryInterface.addIndex('calendar_events', ['opportunity_id'], { name: 'idx_cal_events_opportunity_id' });
    await queryInterface.addIndex('calendar_events', ['assigned_to'], { name: 'idx_cal_events_assigned_to' });
    await queryInterface.addIndex('calendar_events', ['start_date', 'end_date'], { name: 'idx_cal_events_dates' });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('calendar_events', 'idx_cal_events_dates');
    await queryInterface.removeIndex('calendar_events', 'idx_cal_events_assigned_to');
    await queryInterface.removeIndex('calendar_events', 'idx_cal_events_opportunity_id');
    await queryInterface.removeIndex('calendar_events', 'idx_cal_events_lead_id');
    await queryInterface.removeIndex('calendar_events', 'idx_cal_events_customer_id');
    await queryInterface.dropTable('calendar_events');
  },
};
