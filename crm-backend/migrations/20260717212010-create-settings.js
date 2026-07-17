'use strict';
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settings', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      key: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      value: { type: Sequelize.TEXT, allowNull: true },
      group: { type: Sequelize.STRING(50), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });

    // Seed default settings values
    const now = new Date();
    const defaultSettings = [
      // Company Settings
      { uuid: crypto.randomUUID(), key: 'company_name', value: 'Enterprise CRM Ltd', group: 'company', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'company_email', value: 'info@crm.local', group: 'company', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'company_phone', value: '+91 98765 43210', group: 'company', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'company_address', value: '123 Business Tower, Tech Park, Chennai', group: 'company', created_at: now, updated_at: now },
      
      // Email SMTP Settings
      { uuid: crypto.randomUUID(), key: 'email_host', value: 'smtp.mailtrap.io', group: 'email', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'email_port', value: '2525', group: 'email', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'email_username', value: 'smtp_mock_user', group: 'email', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'email_password', value: 'smtp_mock_password', group: 'email', created_at: now, updated_at: now },
      
      // SMS Provider Settings
      { uuid: crypto.randomUUID(), key: 'sms_provider', value: 'twilio', group: 'sms', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'sms_api_key', value: 'twilio_mock_sid', group: 'sms', created_at: now, updated_at: now },
      
      // Tax Settings
      { uuid: crypto.randomUUID(), key: 'tax_name', value: 'GST', group: 'tax', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'tax_rate', value: '18.00', group: 'tax', created_at: now, updated_at: now },
      
      // Currency Settings
      { uuid: crypto.randomUUID(), key: 'currency_code', value: 'INR', group: 'currency', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'currency_symbol', value: '₹', group: 'currency', created_at: now, updated_at: now },
      
      // Localization Settings
      { uuid: crypto.randomUUID(), key: 'timezone', value: 'Asia/Kolkata', group: 'localization', created_at: now, updated_at: now },
      { uuid: crypto.randomUUID(), key: 'date_format', value: 'YYYY-MM-DD', group: 'localization', created_at: now, updated_at: now },
    ];

    await queryInterface.bulkInsert('settings', defaultSettings, {});
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('settings');
  },
};
