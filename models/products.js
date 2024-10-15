const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeDb");

const Product = sequelize.define("Product", {
  product_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    // ref: {
    //   model: User,
    //   key: "user_id",
    // },
  },
});

// sequelize.sync({ alter: true });
module.exports = Product;
