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
    let followSet = new Set();
    let follows = [];

    for (let i = 0; i < 1000; i++) {
      const userId = Math.floor(Math.random() * 100) + 1;
      const followerId = Math.floor(Math.random() * 100) + 1;

      if (userId !== followerId) {
        const followPair = `${userId}-${followerId}`;

        if (!followSet.has(followPair)) {
          followSet.add(followPair);
          follows.push({
            userId,
            followerId,
            createdAt: Sequelize.literal("NOW()"),
            updatedAt: Sequelize.literal("NOW()")
          });
        }
      }
    }

    await queryInterface.bulkInsert('Follows', follows, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Follows', null, {});
  }
};
