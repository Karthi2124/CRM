'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const safeAddIndex = async (table, columns, options) => {
      try {
        await queryInterface.addIndex(table, columns, options);
      } catch (err) {
        if (err.message.includes('Duplicate key') || err.message.includes('already exists')) {
          console.log(`Skipping index ${options.name} on table ${table} (already exists)`);
        } else {
          throw err;
        }
      }
    };

    // 1. Leads Table Indexes
    await safeAddIndex('leads', ['status'], { name: 'idx_leads_status' });
    await safeAddIndex('leads', ['assigned_to'], { name: 'idx_leads_assigned_to' });

    // 2. Opportunities Table Indexes
    await safeAddIndex('opportunities', ['stage_id'], { name: 'idx_opportunities_stage_id' });
    await safeAddIndex('opportunities', ['assigned_to'], { name: 'idx_opportunities_assigned_to' });

    // 3. Invoices Table Indexes
    await safeAddIndex('invoices', ['status'], { name: 'idx_invoices_status' });
    await safeAddIndex('invoices', ['customer_id'], { name: 'idx_invoices_customer_id' });

    // 4. Tasks Table Indexes
    await safeAddIndex('tasks', ['status'], { name: 'idx_tasks_status' });
    await safeAddIndex('tasks', ['due_date'], { name: 'idx_tasks_due_date' });
    await safeAddIndex('tasks', ['assigned_to'], { name: 'idx_tasks_assigned_to' });
  },

  down: async (queryInterface, Sequelize) => {
    const safeRemoveIndex = async (table, indexName) => {
      try {
        await queryInterface.removeIndex(table, indexName);
      } catch (err) {
        console.log(`Skipping removal of index ${indexName} on table ${table}`);
      }
    };

    await safeRemoveIndex('leads', 'idx_leads_status');
    await safeRemoveIndex('leads', 'idx_leads_assigned_to');
    await safeRemoveIndex('opportunities', 'idx_opportunities_stage_id');
    await safeRemoveIndex('opportunities', 'idx_opportunities_assigned_to');
    await safeRemoveIndex('invoices', 'idx_invoices_status');
    await safeRemoveIndex('invoices', 'idx_invoices_customer_id');
    await safeRemoveIndex('tasks', 'idx_tasks_status');
    await safeRemoveIndex('tasks', 'idx_tasks_due_date');
    await safeRemoveIndex('tasks', 'idx_tasks_assigned_to');
  }
};
