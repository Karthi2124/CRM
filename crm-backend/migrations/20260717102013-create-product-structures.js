'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Product Categories
    await queryInterface.createTable('product_categories', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      description: { type: Sequelize.STRING(255), allowNull: true },
      parent_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'product_categories', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // 2. Product Brands
    await queryInterface.createTable('product_brands', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      logo_url: { type: Sequelize.STRING(500), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // 3. Product Units
    await queryInterface.createTable('product_units', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      name: { type: Sequelize.STRING(50), allowNull: false, unique: true }, // e.g. Piece, Kg, Box
      symbol: { type: Sequelize.STRING(10), allowNull: true },              // e.g. pcs, kg
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // 4. Taxes
    await queryInterface.createTable('taxes', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      name: { type: Sequelize.STRING(100), allowNull: false },               // e.g. GST 18%
      rate: { type: Sequelize.DECIMAL(5, 2), allowNull: false },             // e.g. 18.00
      type: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false, defaultValue: 'percentage',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // 5. Products
    await queryInterface.createTable('products', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      sku: { type: Sequelize.STRING(100), allowNull: true, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      category_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'product_categories', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      brand_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'product_brands', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      unit_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'product_units', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      tax_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: true,
        references: { model: 'taxes', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      base_price: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      selling_price: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
      image_url: { type: Sequelize.STRING(500), allowNull: true },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false, defaultValue: 'active',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // 6. Price Lists
    await queryInterface.createTable('price_lists', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      product_id: {
        type: Sequelize.INTEGER.UNSIGNED, allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING(150), allowNull: false },               // e.g. Retail, Wholesale
      price: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      min_quantity: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
      valid_from: { type: Sequelize.DATE, allowNull: true },
      valid_to: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // Indexes
    await queryInterface.addIndex('products', ['category_id'], { name: 'idx_products_category_id' });
    await queryInterface.addIndex('products', ['brand_id'], { name: 'idx_products_brand_id' });
    await queryInterface.addIndex('products', ['status'], { name: 'idx_products_status' });
    await queryInterface.addIndex('price_lists', ['product_id'], { name: 'idx_price_lists_product_id' });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('price_lists', 'idx_price_lists_product_id');
    await queryInterface.removeIndex('products', 'idx_products_status');
    await queryInterface.removeIndex('products', 'idx_products_brand_id');
    await queryInterface.removeIndex('products', 'idx_products_category_id');
    await queryInterface.dropTable('price_lists');
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('taxes');
    await queryInterface.dropTable('product_units');
    await queryInterface.dropTable('product_brands');
    await queryInterface.dropTable('product_categories');
  },
};
