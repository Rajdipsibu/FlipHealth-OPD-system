'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('users', 'user_type', {
      type: Sequelize.ENUM("super_admin", "admin", "customer", "doctor", "pharmacy_owner"),
      allowNull: false,
      defaultValue: 'customer',
      after:'id'
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('Users', 'user_type');
  }
};
