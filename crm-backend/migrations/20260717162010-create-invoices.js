'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Invoices Table
    await queryInterface.createTable('invoices', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      invoice_number: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      customer_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'customers', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      quotation_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'quotations', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      subject: { type: Sequelize.STRING(255), allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      due_date: { type: Sequelize.DATEONLY, allowNull: false },
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
      amount_paid: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      balance_due: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      status: {
        type: Sequelize.ENUM('draft', 'sent', 'partially_paid', 'paid', 'unpaid', 'voided'),
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

    // 2. Invoice Items Table
    await queryInterface.createTable('invoice_items', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      invoice_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'invoices', key: 'id' },
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

    // 3. Payments Table
    await queryInterface.createTable('payments', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      invoice_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'invoices', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      payment_number: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      payment_date: { type: Sequelize.DATEONLY, allowNull: false },
      payment_method: {
        type: Sequelize.ENUM('cash', 'bank_transfer', 'credit_card', 'cheque', 'paypal', 'other'),
        allowNull: false, defaultValue: 'bank_transfer',
      },
      transaction_reference: { type: Sequelize.STRING(100), allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      created_by: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // 4. Credit Notes Table
    await queryInterface.createTable('credit_notes', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      credit_note_number: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      invoice_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'invoices', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      credit_note_date: { type: Sequelize.DATEONLY, allowNull: false },
      reason: { type: Sequelize.STRING(255), allowNull: false },
      status: {
        type: Sequelize.ENUM('draft', 'applied', 'voided'),
        allowNull: false, defaultValue: 'draft',
      },
      created_by: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Indexes
    await queryInterface.addIndex('invoices', ['customer_id'], { name: 'idx_invoices_customer_id' });
    await queryInterface.addIndex('invoices', ['quotation_id'], { name: 'idx_invoices_quotation_id' });
    await queryInterface.addIndex('invoices', ['status'], { name: 'idx_invoices_status' });
    await queryInterface.addIndex('invoice_items', ['invoice_id'], { name: 'idx_invoice_items_invoice_id' });
    await queryInterface.addIndex('payments', ['invoice_id'], { name: 'idx_payments_invoice_id' });
    await queryInterface.addIndex('credit_notes', ['invoice_id'], { name: 'idx_credit_notes_invoice_id' });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('credit_notes', 'idx_credit_notes_invoice_id');
    await queryInterface.removeIndex('payments', 'idx_payments_invoice_id');
    await queryInterface.removeIndex('invoice_items', 'idx_invoice_items_invoice_id');
    await queryInterface.removeIndex('invoices', 'idx_invoices_status');
    await queryInterface.removeIndex('invoices', 'idx_invoices_quotation_id');
    await queryInterface.removeIndex('invoices', 'idx_invoices_customer_id');
    await queryInterface.dropTable('credit_notes');
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('invoice_items');
    await queryInterface.dropTable('invoices');
  },
};
