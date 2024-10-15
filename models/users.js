const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelizeDb");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isLowercase: true,
      validate: {
        isEmail: { msg: "Please enter a valid email." },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: "Phone number must contain only numeric characters.",
        },
        len: {
          args: [10, 10],
          msg: "Phone number must be exactly 10 characters long.",
        },
      },
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("buyer", "seller"),
      defaultValue: "buyer",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8],
          msg: "Password must be atleast 8 characters long.",
        },
      },
    },
  },
  { timestamps: true }
);

// sequelize.sync({ alter: true });

module.exports = User;
