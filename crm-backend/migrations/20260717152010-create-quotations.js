'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Quotations Table
    await queryInterface.createTable('quotations', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      quotation_number: { type: Sequelize.STRING(50), allowNull: false, unique: true },
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
      subject: { type: Sequelize.STRING(255), allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      expiry_date: { type: Sequelize.DATEONLY, allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      discount_type: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false, defaultValue: 'percentage',
      },
      discount_value: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      discount_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      tax_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      adjustment: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      total: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      status: {
        type: Sequelize.ENUM('draft', 'sent', 'accepted', 'declined', 'expired'),
        allowNull: false, defaultValue: 'draft',
      },
      terms_conditions: { type: Sequelize.TEXT, allowNull: true },
      customer_notes: { type: Sequelize.TEXT, allowNull: true },
      created_by: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // 2. Quotation Items Table
    await queryInterface.createTable('quotation_items', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      quotation_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'quotations', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      description: { type: Sequelize.TEXT, allowNull: true },
      quantity: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      unit_price: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      discount_type: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false, defaultValue: 'percentage',
      },
      discount_value: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      discount_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      tax_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'taxes', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      tax_rate: { type: Sequelize.DECIMAL(5, 2), allowNull: false, defaultValue: 0.00 },
      tax_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      subtotal: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      total: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Indexes
    await queryInterface.addIndex('quotations', ['customer_id'], { name: 'idx_quotations_customer_id' });
    await queryInterface.addIndex('quotations', ['lead_id'], { name: 'idx_quotations_lead_id' });
    await queryInterface.addIndex('quotations', ['opportunity_id'], { name: 'idx_quotations_opportunity_id' });
    await queryInterface.addIndex('quotations', ['status'], { name: 'idx_quotations_status' });
    await queryInterface.addIndex('quotation_items', ['quotation_id'], { name: 'idx_quotation_items_quotation_id' });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('quotation_items', 'idx_quotation_items_quotation_id');
    await queryInterface.removeIndex('quotations', 'idx_quotations_status');
    await queryInterface.removeIndex('quotations', 'idx_quotations_opportunity_id');
    await queryInterface.removeIndex('quotations', 'idx_quotations_lead_id');
    await queryInterface.removeIndex('quotations', 'idx_quotations_customer_id');
    await queryInterface.dropTable('quotation_items');
    await queryInterface.dropTable('quotations');
  },
};
