'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Restaurants", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      name_en: {
        type: Sequelize.STRING,
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING(2000),
      },
      location: {
        allowNull: false,
        type: Sequelize.STRING(2000),
      },
      phone: {
        type: Sequelize.STRING,
      },
      google_map: {
        allowNull: false,
        type: Sequelize.STRING(2000),
      },
      rating: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(3000),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Restaurants');
  }
};