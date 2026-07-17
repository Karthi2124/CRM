'use strict';

/**
 * Assign permissions to roles:
 * - Super Admin: ALL permissions
 * - Admin: Most permissions except system-level settings
 * - Sales Manager: leads, opportunities, customers, tasks, reports, quotations, dashboard
 * - Sales Executive: limited leads, opportunities, customers, tasks
 * - Support: customers (view/edit), tasks, calendar
 * - Accountant: invoices, quotations (view), products (view), reports (financial)
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const now = new Date();

    // Fetch all roles
    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM roles WHERE deleted_at IS NULL;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const roleMap = Object.fromEntries(roles.map((r) => [r.name, r.id]));

    // Fetch all permissions
    const permissions = await queryInterface.sequelize.query(
      'SELECT id, module, action FROM permissions WHERE deleted_at IS NULL;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const allPermIds = permissions.map((p) => p.id);

    const getPermIds = (filters) =>
      permissions
        .filter((p) => filters.some((f) => p.module === f.module && (f.action === '*' || p.action === f.action)))
        .map((p) => p.id);

    // ── Super Admin: ALL permissions ─────────────────────────────────────────
    const superAdminAssignments = allPermIds.map((permId) => ({
      role_id: roleMap['Super Admin'],
      permission_id: permId,
      created_at: now,
      updated_at: now,
    }));

    // ── Admin: ALL except audit_logs restore and system destroy ──────────────
    const adminPermIds = getPermIds([
      { module: 'users',         action: '*' },
      { module: 'roles',         action: '*' },
      { module: 'permissions',   action: 'view' },
      { module: 'customers',     action: '*' },
      { module: 'companies',     action: '*' },
      { module: 'contacts',      action: '*' },
      { module: 'leads',         action: '*' },
      { module: 'opportunities', action: '*' },
      { module: 'products',      action: '*' },
      { module: 'quotations',    action: '*' },
      { module: 'invoices',      action: '*' },
      { module: 'tasks',         action: '*' },
      { module: 'calendar',      action: '*' },
      { module: 'notifications', action: '*' },
      { module: 'reports',       action: '*' },
      { module: 'files',         action: '*' },
      { module: 'audit_logs',    action: 'view' },
      { module: 'settings',      action: '*' },
      { module: 'dashboard',     action: 'view' },
    ]);

    // ── Sales Manager ─────────────────────────────────────────────────────────
    const salesManagerPermIds = getPermIds([
      { module: 'dashboard',     action: 'view' },
      { module: 'customers',     action: 'view' }, { module: 'customers',     action: 'create' },
      { module: 'customers',     action: 'edit' }, { module: 'customers',     action: 'add_note' },
      { module: 'customers',     action: 'view_timeline' }, { module: 'customers',     action: 'export' },
      { module: 'leads',         action: '*' },
      { module: 'opportunities', action: '*' },
      { module: 'tasks',         action: '*' },
      { module: 'calendar',      action: '*' },
      { module: 'quotations',    action: '*' },
      { module: 'invoices',      action: 'view' },
      { module: 'products',      action: 'view' },
      { module: 'reports',       action: 'view_sales' }, { module: 'reports',       action: 'view_lead' },
      { module: 'reports',       action: 'view_customer' }, { module: 'reports',       action: 'export_pdf' },
      { module: 'reports',       action: 'export_excel' },
      { module: 'files',         action: 'view' }, { module: 'files',         action: 'upload' },
      { module: 'files',         action: 'download' },
      { module: 'notifications', action: 'view' },
    ]);

    // ── Sales Executive ───────────────────────────────────────────────────────
    const salesExecutivePermIds = getPermIds([
      { module: 'dashboard',     action: 'view' },
      { module: 'customers',     action: 'view' }, { module: 'customers',     action: 'create' },
      { module: 'customers',     action: 'edit' }, { module: 'customers',     action: 'add_note' },
      { module: 'leads',         action: 'view' }, { module: 'leads',         action: 'create' },
      { module: 'leads',         action: 'edit' }, { module: 'leads',         action: 'add_note' },
      { module: 'leads',         action: 'add_followup' }, { module: 'leads',         action: 'view_timeline' },
      { module: 'opportunities', action: 'view' }, { module: 'opportunities', action: 'create' },
      { module: 'opportunities', action: 'edit' },
      { module: 'tasks',         action: 'view' }, { module: 'tasks',         action: 'create' },
      { module: 'tasks',         action: 'edit' }, { module: 'tasks',         action: 'add_comment' },
      { module: 'calendar',      action: 'view' }, { module: 'calendar',      action: 'create' },
      { module: 'quotations',    action: 'view' }, { module: 'quotations',    action: 'create' },
      { module: 'quotations',    action: 'edit' },
      { module: 'products',      action: 'view' },
      { module: 'files',         action: 'view' }, { module: 'files',         action: 'upload' },
      { module: 'files',         action: 'download' },
      { module: 'notifications', action: 'view' },
    ]);

    // ── Support ───────────────────────────────────────────────────────────────
    const supportPermIds = getPermIds([
      { module: 'dashboard',     action: 'view' },
      { module: 'customers',     action: 'view' }, { module: 'customers',     action: 'edit' },
      { module: 'customers',     action: 'add_note' }, { module: 'customers',     action: 'view_timeline' },
      { module: 'tasks',         action: 'view' }, { module: 'tasks',         action: 'create' },
      { module: 'tasks',         action: 'edit' }, { module: 'tasks',         action: 'add_comment' },
      { module: 'calendar',      action: 'view' }, { module: 'calendar',      action: 'create' },
      { module: 'notifications', action: 'view' },
      { module: 'files',         action: 'view' }, { module: 'files',         action: 'download' },
    ]);

    // ── Accountant ────────────────────────────────────────────────────────────
    const accountantPermIds = getPermIds([
      { module: 'dashboard',     action: 'view' },
      { module: 'invoices',      action: '*' },
      { module: 'quotations',    action: 'view' }, { module: 'quotations',    action: 'export_pdf' },
      { module: 'products',      action: 'view' },
      { module: 'customers',     action: 'view' },
      { module: 'reports',       action: 'view_revenue' }, { module: 'reports',       action: 'view_sales' },
      { module: 'reports',       action: 'export_pdf' }, { module: 'reports',       action: 'export_excel' },
      { module: 'files',         action: 'view' }, { module: 'files',         action: 'download' },
      { module: 'notifications', action: 'view' },
    ]);

    const buildAssignments = (roleId, permIds) =>
      [...new Set(permIds)].map((permId) => ({
        role_id: roleId,
        permission_id: permId,
        created_at: now,
        updated_at: now,
      }));

    const allAssignments = [
      ...superAdminAssignments,
      ...buildAssignments(roleMap['Admin'],          adminPermIds),
      ...buildAssignments(roleMap['Sales Manager'],  salesManagerPermIds),
      ...buildAssignments(roleMap['Sales Executive'],salesExecutivePermIds),
      ...buildAssignments(roleMap['Support'],        supportPermIds),
      ...buildAssignments(roleMap['Accountant'],     accountantPermIds),
    ];

    await queryInterface.bulkInsert('role_permissions', allAssignments, {});
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
