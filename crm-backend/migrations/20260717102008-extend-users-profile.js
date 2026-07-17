'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'employee_id', {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
      after: 'uuid',
    });

    await queryInterface.addColumn('users', 'avatar_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
      defaultValue: null,
      after: 'phone',
    });

    await queryInterface.addColumn('users', 'address', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'avatar_url',
    });

    await queryInterface.addColumn('users', 'date_of_birth', {
      type: Sequelize.DATEONLY,
      allowNull: true,
      defaultValue: null,
      after: 'address',
    });

    await queryInterface.addColumn('users', 'gender', {
      type: Sequelize.ENUM('male', 'female', 'other'),
      allowNull: true,
      defaultValue: null,
      after: 'date_of_birth',
    });

    await queryInterface.addIndex('users', ['employee_id'], {
      name: 'idx_users_employee_id',
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('users', 'idx_users_employee_id');
    await queryInterface.removeColumn('users', 'gender');
    await queryInterface.removeColumn('users', 'date_of_birth');
    await queryInterface.removeColumn('users', 'address');
    await queryInterface.removeColumn('users', 'avatar_url');
    await queryInterface.removeColumn('users', 'employee_id');
  },
};
