'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles',[
      {
        name: 'Super Admin',
        code: 'super_admin',
        description: 'Full system access',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Admin',
        code: 'admin',
        description: 'Manage system operations',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Doctor',
        code: 'doctor',
        description: 'Doctor role for consultation',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pharmacy Owner',
        code: 'pharmacy_owner',
        description: 'Manages pharmacy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Customer',
        code: 'customer',
        description: 'End user / patient',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles',null,{});
  }
};
