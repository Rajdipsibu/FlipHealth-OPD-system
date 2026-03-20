'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('actions',[
    {
      name:'create',
      code:'create',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name:'update',
      code:'update',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name:'view',
      code:'view',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name:'delete',
      code:'delete',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name:'listview',
      code:'listview',
      createdAt: new Date(),
      updatedAt: new Date()
    },
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('actions',null,{})
  }
};
