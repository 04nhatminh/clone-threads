'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Thread, {
        foreignKey: 'userId',
        as: 'threads'
      });
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments'
      });
      User.hasMany(models.Like, {
        foreignKey: 'userId',
        as: 'likes'
      });
      User.hasMany(models.Notification, {
        foreignKey: 'userId',
        as: 'notifications'
      });
      User.hasMany(models.Follow, {
        foreignKey: 'userId',
        as: 'follows'
      });
      User.hasMany(models.Follow, {
        foreignKey: 'followerId',
        as: 'followers'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notNull: true,
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
      }
    },
    password: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    description: DataTypes.STRING,
    website: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};