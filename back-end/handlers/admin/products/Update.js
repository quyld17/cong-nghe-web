const { tokenVerification } = require("../../../middlewares/JWT");
const { verifyAdmin } = require("../../../entities/Users");
const { updateProduct } = require("../../../entities/Products");

const Router = require("express");
const r = Router();

r.patch("/product", Router.json(), async (req, res) => {
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
        product.product_id === null ||
        product.category_id === null ||
        product.product_name === "" ||
        product.price === null ||
        product.in_stock_quantity === null ||
        product.image_url === ""
      ) {
        return res.status(400).json("No input");
      }
      const updateProductResult = await updateProduct(product);
      if (updateProductResult) {
        return res.status(200).json("Updated product successfully");
      } else {
        return res.status(500).json("Failed to update product");
      }
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json("Internal Server Error");
    }
  } else {
    return res.status(400).json("Bad request");
  }
});

module.exports = r;
