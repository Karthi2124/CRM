'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password_reset_token', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'last_login_at',
    });

    await queryInterface.addColumn('users', 'password_reset_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
      after: 'password_reset_token',
    });

    // Index for faster lookup during reset
    await queryInterface.addIndex('users', ['password_reset_token'], {
      name: 'idx_users_password_reset_token',
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('users', 'idx_users_password_reset_token');
    await queryInterface.removeColumn('users', 'password_reset_expires_at');
    await queryInterface.removeColumn('users', 'password_reset_token');
  },
};
