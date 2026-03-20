'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
   await queryInterface.bulkInsert('permissionroles',[
    {
      //super admin
      role_id:31,
      module_action_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:6,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:7,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:9,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:10,
      createdAt: new Date(),
      updatedAt: new Date()
    },  
    {
      //super admin
      role_id:31,
      module_action_id:11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:13,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:14,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:16,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:17,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:18,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:19,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      //super admin
      role_id:31,
      module_action_id:20,
      createdAt: new Date(),
      updatedAt: new Date()
    }
   ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissionroles'.null,{})
  }
};
