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
    let threads = [];

    for (let i = 0; i < 1000; i++) {
      threads.push({
        content: faker.lorem.paragraph(2),
        userId: Math.floor(Math.random() * 100) + 1,
        imageUrl: faker.image.url(),
        createdAt: Sequelize.literal("NOW()"),
        updatedAt: Sequelize.literal("NOW()")
      });
    }

    await queryInterface.bulkInsert('Threads', threads, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Threads', null, {});
  }
};
