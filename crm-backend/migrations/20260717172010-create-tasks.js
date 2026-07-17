'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Tasks Table
    await queryInterface.createTable('tasks', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      title: { type: Sequelize.STRING(150), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM('todo', 'in_progress', 'completed', 'deferred'),
        allowNull: false, defaultValue: 'todo',
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false, defaultValue: 'medium',
      },
      due_date: { type: Sequelize.DATEONLY, allowNull: true },
      assigned_to: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
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
      created_by: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // 2. Task Comments Table
    await queryInterface.createTable('task_comments', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      task_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'tasks', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      comment: { type: Sequelize.TEXT, allowNull: false },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // 3. Task Attachments Table
    await queryInterface.createTable('task_attachments', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      task_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'tasks', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      file_name: { type: Sequelize.STRING(255), allowNull: false },
      file_url: { type: Sequelize.STRING(500), allowNull: false },
      file_size: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      mime_type: { type: Sequelize.STRING(100), allowNull: true },
      uploaded_by: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Indexes
    await queryInterface.addIndex('tasks', ['assigned_to'], { name: 'idx_tasks_assigned_to' });
    await queryInterface.addIndex('tasks', ['customer_id'], { name: 'idx_tasks_customer_id' });
    await queryInterface.addIndex('tasks', ['lead_id'], { name: 'idx_tasks_lead_id' });
    await queryInterface.addIndex('tasks', ['opportunity_id'], { name: 'idx_tasks_opportunity_id' });
    await queryInterface.addIndex('tasks', ['status'], { name: 'idx_tasks_status' });
    await queryInterface.addIndex('tasks', ['priority'], { name: 'idx_tasks_priority' });
    await queryInterface.addIndex('task_comments', ['task_id'], { name: 'idx_task_comments_task_id' });
    await queryInterface.addIndex('task_attachments', ['task_id'], { name: 'idx_task_attachments_task_id' });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('task_attachments', 'idx_task_attachments_task_id');
    await queryInterface.removeIndex('task_comments', 'idx_task_comments_task_id');
    await queryInterface.removeIndex('tasks', 'idx_tasks_priority');
    await queryInterface.removeIndex('tasks', 'idx_tasks_status');
    await queryInterface.removeIndex('tasks', 'idx_tasks_opportunity_id');
    await queryInterface.removeIndex('tasks', 'idx_tasks_lead_id');
    await queryInterface.removeIndex('tasks', 'idx_tasks_customer_id');
    await queryInterface.removeIndex('tasks', 'idx_tasks_assigned_to');
    await queryInterface.dropTable('task_attachments');
    await queryInterface.dropTable('task_comments');
    await queryInterface.dropTable('tasks');
  },
};
