'use strict';
const crypto = require('crypto');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch the Super Admin role id
    const roles = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'Super Admin' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!roles || roles.length === 0) {
      throw new Error("Super Admin role not found. Please run the roles seeder first.");
    }

    const superAdminRoleId = roles[0].id;
    const passwordHash = await bcrypt.hash('Admin@123', 10);

    await queryInterface.bulkInsert('users', [{
      uuid: crypto.randomUUID(),
      first_name: 'Super',
      last_name: 'Admin',
      email: 'admin@crm.com',
      phone: '+1234567890',
      password_hash: passwordHash,
      role_id: superAdminRoleId,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@crm.com' }, {});
  }
};
