'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('modules',[
    {
      name:'network',
      code:'network',
      description:'network management system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name:'pharmacy',
      code:'pharmacy',
      description:'pharmacy management system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name:'consultation',
      code:'consultation',
      description:'doctor consultation management system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name:'health',
      code:'health',
      description:'health management system',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('modules',null,{});
  }
};
