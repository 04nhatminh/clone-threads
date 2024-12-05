'use strict';
const { faker } = require('@faker-js/faker');

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
    let notifications = [];

    for (let i = 0; i < 1000; i++) {
      notifications.push({
        userId: Math.floor(Math.random() * 100) + 1,
        type: faker.helpers.arrayElement(["like", "comment", "follow"]),
        isRead: Math.random() < 0.5,
        createdAt: Sequelize.literal("NOW()"),
        updatedAt: Sequelize.literal("NOW()")
      });
    }

    await queryInterface.bulkInsert('Notifications', notifications, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Notifications', null, {});
  }
};
