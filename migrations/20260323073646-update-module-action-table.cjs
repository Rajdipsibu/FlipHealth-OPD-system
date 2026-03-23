'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('ModuleActions', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('ModuleActions', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after:'action_id'
    });

    await queryInterface.addColumn('ModuleActions', 'is_deleted', {
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
    // 2. Remove the new columns
    await queryInterface.removeColumn('ModuleActions', 'status');
    await queryInterface.removeColumn('ModuleActions', 'is_deleted');
  }
};
