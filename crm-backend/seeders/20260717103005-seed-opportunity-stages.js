'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const now = new Date();
    const stages = [
      { uuid: crypto.randomUUID(), name: 'Qualification', probability: 10, order: 1, created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Needs Analysis', probability: 20, order: 2, created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Value Proposition', probability: 40, order: 3, created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Decision Makers', probability: 60, order: 4, created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Proposal/Price Quote', probability: 75, order: 5, created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Negotiation/Review', probability: 90, order: 6, created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Closed Won', probability: 100, order: 7, created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Closed Lost', probability: 0, order: 8, created_at: now, updated_at: now },
    ];

    await queryInterface.bulkInsert('opportunity_stages', stages, {});
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('opportunity_stages', null, {});
  },
};
