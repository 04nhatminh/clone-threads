'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Thread.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Thread.hasMany(models.Comment, {
        foreignKey: 'threadId',
        as: 'comments'
      });
      Thread.hasMany(models.Like, {
        foreignKey: 'threadId',
        as: 'likes'
      });
    }
  }
  Thread.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Thread',
  });
  return Thread;
};