const { tokenVerification } = require("../../../middlewares/JWT");
const { verifyAdmin } = require("../../../entities/Users");
const { createProduct } = require("../../../entities/Products");

const express = require("express");
const r = express();

r.put("/product", express.json(), async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }
  const verifyAdminResult = await verifyAdmin(user_id);
  if (!verifyAdminResult) {
    return res.status(403).json("User not allowed");
  }

  const product = req.body;
  if (product) {
    try {
      if (
        product.category_id === null ||
        product.product_name === "" ||
        product.price === null ||
        product.in_stock_quantity === null ||
        product.image_urls.length === 0
      ) {
        return res.status(400).json("No input");
      }
      const createProductResult = await createProduct(product);
      if (createProductResult) {
        return res.status(200).json("Created product successfully");
      } else {
        return res.status(500).json("Failed to create product");
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json("Internal Server Error");
    }
  } else {
    res.status(400).json("Bad request");
  }
});

module.exports = r;
