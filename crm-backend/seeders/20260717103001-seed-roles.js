'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [
      {
        uuid: crypto.randomUUID(),
        name: 'Super Admin',
        description: 'Super Administrator with full system access',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Admin',
        description: 'Administrator with management capabilities',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Sales Manager',
        description: 'Sales Manager overseeing sales teams and pipelines',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Sales Executive',
        description: 'Sales Executive handling deals and leads',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Support',
        description: 'Support representative resolving customer tickets',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Accountant',
        description: 'Accountant managing invoices and financials',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('roles', roles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
