'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  todo.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    memo: DataTypes.STRING,
    posted: DataTypes.DATE,
    finished: DataTypes.DATE,
    checked: DataTypes.INTEGER,
    priority: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'todo',
  });
  return todo;
};