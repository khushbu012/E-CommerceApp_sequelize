const sequelize = require("../config/sequelizeDb");
const { Cart, CartItem } = require("../models/carts");
const Product = require("../models/products");

exports.addToCart = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne(
      {
        where: { userId },
        include: { model: CartItem, as: "items" },
      },
      { transaction: t }
    );

    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let cartItem = await CartItem.findOne(
      {
        where: { CartId: cart.id, productId },
      },
      { transaction: t }
    );

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        productId,
        quantity,
        CartId: cart.id,
      });
    }

    // Refresh cart to get the updated items
    cart = await Cart.findByPk(
      cart.id,
      {
        include: [
          {
            model: CartItem,
            as: "items",
            include: { model: Product, attributes: ["product_name"] },
            attributes: { exclude: ["createdAt", "updatedAt", "CartId", "id"] },
          },
        ],
      },
      { transaction: t }
    );
    await t.commit();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    await t.rollback();
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getCartProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        as: "items",
        include: {
          model: Product,
          attributes: ["product_name"],
        },
      },
    });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Extract product names from the populated product documents
    const productNames = cart.items.map((item) => {
      if (item.Product && item.Product.product_name) {
        return item.Product.product_name; //product_name is the field in Product model
      }
      return null;
    });

    res.status(200).json({ success: true, productNames });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Manage cart items means increasing or decreasing the quantity
exports.manageCartItems = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const productId = req.query.productId;
    const action = req.query.action;

    const existingCart = await Cart.findOne(
      {
        where: { userId },
        include: { model: CartItem, as: "items" },
      },
      { transaction: t }
    );
    if (!existingCart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const existingItem = existingCart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the user cart",
      });
    }

    if (action === "increase") {
      existingItem.quantity++;
    } else if (action === "decrease") {
      existingItem.quantity--;

      if (existingItem.quantity === 0) {
        await existingItem.destroy();
      }
      // } else {
      //   // Save the cart item if quantity is decreased
      //   await existingItem.save();
      // }
    } else {
      return res.status(400).json({
        success: false,
        message: `Invalid action '${action}'`,
      });
    }
    await existingCart.save();

    const updatedCart = await Cart.findByPk(existingCart.id, {
      include: [
        {
          model: CartItem,
          as: "items",
          include: { model: Product, attributes: ["product_name", "price"] },
          attributes: { exclude: ["createdAt", "updatedAt", "CartId", "id"] },
        },
      ],
      transaction: t,
    });
    return res.status(200).json({
      message: `${action} quantity`,
      updatedCart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cart not found" });
  }
};

// Delete a item from the cart of particular user
exports.deleteItem = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const productId = req.query.productId;

    const existingCart = await Cart.findOne(
      {
        where: { userId },
        include: { model: CartItem, as: "items" },
      },
      { transaction: t }
    );

    if (!existingCart) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const existingItem = existingCart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingItem) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Product not found in the user cart",
      });
    }

    await existingItem.destroy();

    const updatedCart = await Cart.findByPk(existingCart.id, {
      include: [
        {
          model: CartItem,
          as: "items",
          attributes: { exclude: ["createdAt", "updatedAt", "CartId", "id"] },
        },
      ],
      transaction: t,
    });

    // If there are no remaining items in the cart, delete the cart itself
    if (updatedCart.items.length === 0) {
      await updatedCart.destroy();
      return res.status(200).json({
        success: true,
        message: "Item removed from cart and cart deleted",
      });
    }

    await t.commit();
    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      updatedCart: updatedCart,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json(error.message);
  }
};
