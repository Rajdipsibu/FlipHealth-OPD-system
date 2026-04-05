'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('user_mfa_configs', {
      id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // One user can only have one active MFA config
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      mfa_type: {
        type: Sequelize.ENUM('totp', 'sms', 'email'),
        defaultValue: 'totp'
      },
      secret: {
        type: Sequelize.TEXT, // Store ENCRYPTED using your crypto.util.ts
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false // Only true after they verify their first code
      },
      recovery_codes: {
        type: Sequelize.JSON, // Store as an array of hashed strings
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('user_mfa_configs');
  }
};
