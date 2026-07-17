'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Leads Table
    await queryInterface.createTable('leads', {
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
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'manual', // manual, website, referral, advertisement, social_media
      },
      status: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'new', // new, contacted, qualified, lost
      },
      value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0.00,
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

    // 2. Lead Notes Table
    await queryInterface.createTable('lead_notes', {
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
      lead_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'leads',
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

    // 3. Lead Follow-ups Table
    await queryInterface.createTable('lead_followups', {
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
      lead_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'leads',
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
      followup_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
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

    // 4. Lead Activities Table
    await queryInterface.createTable('lead_activities', {
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
      lead_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'leads',
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
      type: {
        type: Sequelize.ENUM('call', 'email', 'meeting', 'task'),
        allowNull: false,
        defaultValue: 'call',
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      activity_date: {
        type: Sequelize.DATE,
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

    // Add indexes for performance
    await queryInterface.addIndex('leads', ['email'], { name: 'idx_leads_email' });
    await queryInterface.addIndex('leads', ['assigned_to'], { name: 'idx_leads_assigned_to' });
    await queryInterface.addIndex('lead_notes', ['lead_id'], { name: 'idx_lead_notes_lead_id' });
    await queryInterface.addIndex('lead_followups', ['lead_id'], { name: 'idx_lead_followups_lead_id' });
    await queryInterface.addIndex('lead_activities', ['lead_id'], { name: 'idx_lead_activities_lead_id' });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeIndex('lead_activities', 'idx_lead_activities_lead_id');
    await queryInterface.removeIndex('lead_followups', 'idx_lead_followups_lead_id');
    await queryInterface.removeIndex('lead_notes', 'idx_lead_notes_lead_id');
    await queryInterface.removeIndex('leads', 'idx_leads_assigned_to');
    await queryInterface.removeIndex('leads', 'idx_leads_email');

    await queryInterface.dropTable('lead_activities');
    await queryInterface.dropTable('lead_followups');
    await queryInterface.dropTable('lead_notes');
    await queryInterface.dropTable('leads');
  },
};
