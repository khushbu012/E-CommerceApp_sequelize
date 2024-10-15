const express = require("express");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { syncTables } = require("./models/index");
const app = express();
const { errRes } = require("./middleware/errorResponse");

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

syncTables();

//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/orders", orderRoutes);

app.use(errRes);
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
