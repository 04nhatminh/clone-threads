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
    let likes = [];
    let likesSet = new Set();

    for (let i = 0; i < 1000; i++) {
      let userId = Math.floor(Math.random() * 100) + 1;
      let threadId = Math.floor(Math.random() * 100) + 1;

      let likePair = `${userId}-${threadId}`;
      if (!likesSet.has(likePair)) {
        likesSet.add(likePair);
        likes.push({
          userId,
          threadId,
          createdAt: Sequelize.literal("NOW()"),
          updatedAt: Sequelize.literal("NOW()")
        });
      }
    }

    await queryInterface.bulkInsert('Likes', likes, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Likes', null, {});
  }
};
