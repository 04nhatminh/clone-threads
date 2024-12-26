'use strict';
const { faker } = require('@faker-js/faker');
const { hashPassword, comparePassword } = require('../utils/bcryptUtils');

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
    let users = [];

    for (let i = 0; i < 100; i++) {
      const usernameLength = faker.number.int({ min: 10, max: 18 }); // Độ dài username từ 5 đến 15 ký tự
      const username = Array.from({ length: usernameLength }, () => 
        faker.helpers.arrayElement('abcdefghijklmnopqrstuvwxyz._')
      ).join('');

      users.push({
        email: faker.internet.email(),
        username: username,
        password: await hashPassword("123456789"),
        fullName: faker.person.fullName(),
        avatarUrl: faker.image.avatar(),
        description: faker.person.bio(),
        website: faker.internet.url(),
        createdAt: Sequelize.literal("NOW()"),
        updatedAt: Sequelize.literal("NOW()")
      });
    }

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
