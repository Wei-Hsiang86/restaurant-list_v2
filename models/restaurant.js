'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Restaurant.init({
    name: DataTypes.STRING,
    name_en: DataTypes.STRING,
    category: DataTypes.STRING,
    image: DataTypes.STRING(2000),
    location: DataTypes.STRING(1000),
    phone: DataTypes.STRING,
    google_map: DataTypes.STRING(2000),
    rating: DataTypes.FLOAT,
    description: DataTypes.STRING(3000)
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};