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
    await queryInterface.changeColumn('Modules', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false // This tells Sequelize/MySQL to remove the constraint
    });

    // Optional: Safety check to drop the index if it persists
    try {
      await queryInterface.removeIndex('Modules', 'name');
    } catch (e) {
      console.log('Index not found, skipping index removal.');
    }

    await queryInterface.addColumn('Modules', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after:'description'
    });

    await queryInterface.addColumn('Modules', 'is_deleted', {
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
    await queryInterface.changeColumn('Modules', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });

    // 2. Remove the new columns
    await queryInterface.removeColumn('Modules', 'status');
    await queryInterface.removeColumn('Modules', 'is_deleted');
  }
};
