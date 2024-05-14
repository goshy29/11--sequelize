// 171. Adding an Order Model

const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.STRING,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;