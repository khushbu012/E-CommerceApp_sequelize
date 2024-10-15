const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeDb");
const Product = require("./products");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
});

const CartItem = sequelize.define("CartItem", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

Cart.hasMany(CartItem, { as: "items" });
CartItem.belongsTo(Cart);

CartItem.belongsTo(Product, { foreignKey: 'productId' });

// sequelize.sync();
module.exports = { Cart, CartItem };
