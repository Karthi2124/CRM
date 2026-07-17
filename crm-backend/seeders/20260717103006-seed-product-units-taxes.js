'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    const now = new Date();

    // Product Units
    await queryInterface.bulkInsert('product_units', [
      { uuid: crypto.randomUUID(), name: 'Piece', symbol: 'pcs', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Kilogram', symbol: 'kg', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Litre', symbol: 'ltr', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Meter', symbol: 'm', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Box', symbol: 'box', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Dozen', symbol: 'dz', created_at: now, updated_at: now },
    ], {});

    // Common Taxes
    await queryInterface.bulkInsert('taxes', [
      { uuid: crypto.randomUUID(), name: 'GST 5%', rate: 5.00, type: 'percentage', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'GST 12%', rate: 12.00, type: 'percentage', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'GST 18%', rate: 18.00, type: 'percentage', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'GST 28%', rate: 28.00, type: 'percentage', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), name: 'Tax Exempt', rate: 0.00, type: 'percentage', created_at: now, updated_at: now },
    ], {});
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete('taxes', null, {});
    await queryInterface.bulkDelete('product_units', null, {});
  },
};
