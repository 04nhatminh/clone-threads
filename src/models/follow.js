'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Follow.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Follow.belongsTo(models.User, {
        foreignKey: 'followerId',
        as: 'follower'
      });
    }
  }
  Follow.init({
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    followerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Follow',
  });
  return Follow;
};