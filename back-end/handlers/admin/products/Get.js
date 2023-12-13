const { tokenVerification } = require("../../../middlewares/JWT");
const { verifyAdmin } = require("../../../entities/Users");
const {
  getProducts,
  getProductDetails,
} = require("../../../entities/Products");

const Router = require("express");
const r = Router();

r.get("/products", async (req, res) => {
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

  try {
    const products = await getProducts();
    if (products) {
      return res.status(200).json(products);
    } else {
      return res.status(204).json("No products found");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json("Internal Server Error");
  }
});

r.get("/product/:id", async (req, res) => {
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

  const product_id = req.params.id;
  if (product_id) {
    try {
      const product = await getProductDetails(product_id);
      if (product) {
        return res.status(200).json(product);
      } else {
        return res.status(204).json("No product details found");
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
