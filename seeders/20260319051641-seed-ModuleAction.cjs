'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('moduleactions',[
    {
      //network
      module_id:9,
      //create
      action_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //network
      module_id:9,
      //update
      action_id:2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //network
      module_id:9,
      //view
      action_id:3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //network
      module_id:9,
      //delete
      action_id:4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //network
      module_id:9,
      //listview
      action_id:5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //pharmacy
      module_id:10,
      action_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //pharmacy
      module_id:10,
      action_id:2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //pharmacy
      module_id:10,
      action_id:3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //pharmacy
      module_id:10,
      action_id:4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //pharmacy
      module_id:10,
      action_id:5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //consultation
      module_id:11,
      action_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //consultation
      module_id:11,
      action_id:2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //consultation
      module_id:11,
      action_id:3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //consultation
      module_id:11,
      action_id:4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //consultation
      module_id:11,
      action_id:5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //health
      module_id:12,
      action_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //health
      module_id:12,
      action_id:2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //health
      module_id:12,
      action_id:3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //health
      module_id:12,
      action_id:4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //health
      module_id:12,
      action_id:5,
      createdAt: new Date(),
      updatedAt: new Date()
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('moduleactions',null,{})
  }
};
