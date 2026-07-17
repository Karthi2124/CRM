'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Customers Table
    await queryInterface.createTable('customers', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('company', 'individual'),
        allowNull: false,
        defaultValue: 'company',
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      gst_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      tax_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
      created_by: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 2. Customer Addresses Table
    await queryInterface.createTable('customer_addresses', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      customer_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.ENUM('billing', 'shipping'),
        allowNull: false,
        defaultValue: 'billing',
      },
      address_line_1: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address_line_2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      zip_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 3. Customer Contacts Table (Multiple contact persons for a company)
    await queryInterface.createTable('customer_contacts', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      customer_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      designation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 4. Customer Notes Table
    await queryInterface.createTable('customer_notes', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      customer_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Indexes
    await queryInterface.addIndex('customers', ['email'], { name: 'idx_customers_email' });
    await queryInterface.addIndex('customer_addresses', ['customer_id'], { name: 'idx_addresses_customer_id' });
    await queryInterface.addIndex('customer_contacts', ['customer_id'], { name: 'idx_contacts_customer_id' });
    await queryInterface.addIndex('customer_notes', ['customer_id'], { name: 'idx_notes_customer_id' });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('customer_notes', 'idx_notes_customer_id');
    await queryInterface.removeIndex('customer_contacts', 'idx_contacts_customer_id');
    await queryInterface.removeIndex('customer_addresses', 'idx_addresses_customer_id');
    await queryInterface.removeIndex('customers', 'idx_customers_email');

    await queryInterface.dropTable('customer_notes');
    await queryInterface.dropTable('customer_contacts');
    await queryInterface.dropTable('customer_addresses');
    await queryInterface.dropTable('customers');
  },
};
