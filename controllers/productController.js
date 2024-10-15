const sequelize = require("../config/sequelizeDb");
const Product = require("../models/products");

exports.createProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { product_name, description, price } = req.body;

    if (!product_name || !description || !price) {
      await t.rollback();
      return res
        .status(400)
        .json("Missing fields.Please enter all the fields.");
    }
    const product = await Product.create(
      {
        product_name,
        description,
        price,
        user_id: req.user.id,
      },
      { transaction: t }
    );
    await t.commit();
    res
      .status(201)
      .json({ message: "Product added successfully", data: product });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1; //enter in params in postman
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const startIndex = (page - 1) * limit;

    const totalProducts = await Product.findAll({
      startIndex,
      limit,
      attributes: { exclude: ["createdAt", "updatedAt", "user_id"] },
    });
    const totalCount = await Product.count();

    if (startIndex >= totalCount) {
      return res.status(404).json("No more products on the further pages!");
    }
    res.status(200).json({
      message: "Success",
      data: totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt", "user_id"] },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Success", data: product });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const productId = req.params.id;
    const newProductData = req.body;

    // Find the product and check if the current user is the seller
    const product = await Product.findOne({
      where: {
        product_id: productId,
        user_id: req.user.id,
      },
      transaction: t,
    });

    if (!product) {
      await t.rollback();
      return res.status(404).json({
        message: "Product not found or you are not the correct seller",
      });
    }

    // Fetch the updated product
    const updatedProduct = await Product.findByPk(productId, {
      transaction: t,
    });
    // Update the product
    await updatedProduct.update(newProductData, { transaction: t });

    await t.commit();
    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const productId = req.params.id;
    const product = await Product.findOne({
      where: {
        product_id: productId,
        user_id: req.user.id,
      },
      transaction: t,
    });

    if (!product) {
      await t.rollback();
      return res.status(404).json({
        message: "Product not found or you are not the correct seller",
      });
    }
    const p = await Product.findByPk(req.params.id, { transaction: t });
    await p.destroy({ transaction: t });
    await t.commit();
    res.status(200).json({ message: "Product deleted successfully, " });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Failed", error: error.message });
  }
};
