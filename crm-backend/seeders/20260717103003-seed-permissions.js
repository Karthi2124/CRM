'use strict';
const crypto = require('crypto');

/**
 * Seed all system permissions (module.action format) across all CRM modules.
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const now = new Date();

    // Define all permissions per module
    const modules = {
      users:         ['view', 'create', 'edit', 'delete', 'export', 'import', 'reset_password', 'change_status'],
      roles:         ['view', 'create', 'edit', 'delete', 'assign_permissions'],
      permissions:   ['view'],
      customers:     ['view', 'create', 'edit', 'delete', 'export', 'import', 'add_note', 'view_timeline'],
      companies:     ['view', 'create', 'edit', 'delete', 'manage_branches', 'manage_departments', 'manage_designations'],
      contacts:      ['view', 'create', 'edit', 'delete'],
      leads:         ['view', 'create', 'edit', 'delete', 'assign', 'export', 'import', 'add_note', 'add_followup', 'view_timeline'],
      opportunities: ['view', 'create', 'edit', 'delete', 'assign', 'export', 'view_timeline'],
      products:      ['view', 'create', 'edit', 'delete', 'export', 'import', 'manage_categories', 'manage_brands', 'manage_pricing'],
      quotations:    ['view', 'create', 'edit', 'delete', 'send', 'approve', 'export_pdf', 'duplicate', 'convert_invoice'],
      invoices:      ['view', 'create', 'edit', 'delete', 'export_pdf', 'record_payment', 'send', 'manage_credit_notes'],
      tasks:         ['view', 'create', 'edit', 'delete', 'assign', 'add_comment', 'add_attachment'],
      calendar:      ['view', 'create', 'edit', 'delete'],
      notifications: ['view', 'manage_templates', 'manage_preferences'],
      reports:       ['view_sales', 'view_customer', 'view_lead', 'view_task', 'view_revenue', 'view_user', 'export_pdf', 'export_excel'],
      files:         ['view', 'upload', 'delete', 'download'],
      audit_logs:    ['view'],
      settings:      ['view', 'edit_company', 'edit_email', 'edit_sms', 'edit_tax', 'edit_currency', 'edit_localization'],
      dashboard:     ['view'],
    };

    const permissions = [];
    for (const [module, actions] of Object.entries(modules)) {
      for (const action of actions) {
        permissions.push({
          uuid: crypto.randomUUID(),
          module,
          action,
          description: `${module.replace(/_/g, ' ')} — ${action.replace(/_/g, ' ')}`,
          created_at: now,
          updated_at: now,
        });
      }
    }

    await queryInterface.bulkInsert('permissions', permissions, {});
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
