const Order = require("../models/orders");
const Product = require("../models/products"); // Import Product model
const { Cart, CartItem } = require("../models/carts");
const sequelize = require("../config/sequelizeDb");

exports.placeOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              attributes: ["product_name", "price"],
            },
          ],
        },
      ],
      transaction: t,
    });

    if (!cart || cart.items.length === 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        msg: "Your cart is empty. Add items before placing an order.",
      });
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.Product.price * item.quantity,
      0
    );

    const orderItems = cart.items.map((item) => ({
      productName: item.Product.product_name,
      quantity: item.quantity,
      unitPrice: item.Product.price,
    }));

    const order = await Order.create(
      {
        userId: userId,
        items: orderItems,
        totalAmount: totalAmount,
      },
      { transaction: t }
    );

    await cart.setItems([]); // Clear cart items
    await t.commit();
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderedItems: order,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.orderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Orders Found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Your previous orders:",
      previousOrder: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
