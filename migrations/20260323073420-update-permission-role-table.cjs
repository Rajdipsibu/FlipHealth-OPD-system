'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('PermissionRoles', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('PermissionRoles', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after:'module_action_id'
    });

    await queryInterface.addColumn('PermissionRoles', 'is_deleted', {
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
    await queryInterface.removeColumn('PermissionRoles', 'status');
    await queryInterface.removeColumn('PermissionRoles', 'is_deleted');
  }
};
