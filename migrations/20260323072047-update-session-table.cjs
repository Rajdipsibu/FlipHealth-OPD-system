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
    await queryInterface.changeColumn('sessions', 'type', {
      type: Sequelize.ENUM("access_token", "refresh_token", "reset_token", "otp"),
      allowNull: false
    });

    await queryInterface.addColumn('sessions', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after:'expires_at'
    });

    await queryInterface.addColumn('sessions', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after:'status'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('sessions', 'type', {
      type: Sequelize.ENUM("access_token", "refresh_token", "reset_token"),
      allowNull: false
    });
    // 2. Remove the new columns
    await queryInterface.removeColumn('sessions', 'status');
    await queryInterface.removeColumn('sessions', 'is_deleted');
  }
};
