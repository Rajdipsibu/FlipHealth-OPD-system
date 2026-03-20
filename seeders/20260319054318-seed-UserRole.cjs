'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('userroles',[
    {
      //super admin
      user_id:1,
      role_id:31,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //admin
      user_id:2,
      role_id:32,
      createdAt: new Date(),
      updatedAt: new Date()
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userroles',null,{})
  }
};
