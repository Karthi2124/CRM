'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Opportunity Stages Table
    await queryInterface.createTable('opportunity_stages', {
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
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      probability: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 10, // 0 - 100 percentage
      },
      order: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
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

    // 2. Opportunities Table
    await queryInterface.createTable('opportunities', {
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
      lead_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'leads',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      stage_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'opportunity_stages',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      probability: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 10,
      },
      expected_revenue: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      close_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      assigned_to: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      lost_reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      win_reason: {
        type: Sequelize.STRING(255),
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

    // 3. Opportunity Competitors Table
    await queryInterface.createTable('opportunity_competitors', {
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
      opportunity_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'opportunities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      competitor_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      strength: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      weakness: {
        type: Sequelize.TEXT,
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

    // 4. Opportunity Notes Table
    await queryInterface.createTable('opportunity_notes', {
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
      opportunity_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'opportunities',
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

    // Add indexes
    await queryInterface.addIndex('opportunities', ['customer_id'], { name: 'idx_opp_customer_id' });
    await queryInterface.addIndex('opportunities', ['stage_id'], { name: 'idx_opp_stage_id' });
    await queryInterface.addIndex('opportunities', ['assigned_to'], { name: 'idx_opp_assigned_to' });
    await queryInterface.addIndex('opportunity_competitors', ['opportunity_id'], { name: 'idx_opp_comp_opp_id' });
    await queryInterface.addIndex('opportunity_notes', ['opportunity_id'], { name: 'idx_opp_notes_opp_id' });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('opportunity_notes', 'idx_opp_notes_opp_id');
    await queryInterface.removeIndex('opportunity_competitors', 'idx_opp_comp_opp_id');
    await queryInterface.removeIndex('opportunities', 'idx_opp_assigned_to');
    await queryInterface.removeIndex('opportunities', 'idx_opp_stage_id');
    await queryInterface.removeIndex('opportunities', 'idx_opp_customer_id');

    await queryInterface.dropTable('opportunity_notes');
    await queryInterface.dropTable('opportunity_competitors');
    await queryInterface.dropTable('opportunities');
    await queryInterface.dropTable('opportunity_stages');
  },
};
