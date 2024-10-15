const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeDb");
// const Product = require("./products");
const User = require("./users");

const Order = sequelize.define("Order", {
  order_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID, // Use the same type as in the User model
    allowNull: false,
    references: {
      model: User, // Reference the User model
      key: "user_id", // Key to reference in User model
    },
  },
  items: {
    type: DataTypes.JSONB, // Store items as JSONB
    allowNull: false,
  },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Use defaultValue for createdAt
});

module.exports = Order;
