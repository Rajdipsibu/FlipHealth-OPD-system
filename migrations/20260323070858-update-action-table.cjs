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
    await queryInterface.changeColumn('Actions', 'code', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });

    await queryInterface.addColumn('Actions', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after:'code'
    });

    await queryInterface.addColumn('Actions', 'is_deleted', {
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
    await queryInterface.changeColumn('Actions', 'code', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });
    
    // 2. Remove the new columns
    await queryInterface.removeColumn('Actions', 'status');
    await queryInterface.removeColumn('Actions', 'is_deleted');
  }
};
