const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("e-commerce_app", "postgres", "khushbu07", {
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  logging: false,
});

const connect = async () => {
  try {
    await sequelize.authenticate(); 
    console.log("Connection has been established successfully with database.");
  } catch (err) {
    console.log("Unable to connect to the database:", err.message);
  }
};

connect();

sequelize.sync({ alter: true });
module.exports = sequelize;
