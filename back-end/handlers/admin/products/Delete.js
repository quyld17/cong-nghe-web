const { tokenVerification } = require("../../../middlewares/JWT");
const { verifyAdmin } = require("../../../entities/Users");
const { deleteProduct } = require("../../../entities/Products");

const Router = require("express");
const r = Router();

r.delete("/product/:id", async (req, res) => {
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
      const deleteProductResult = await deleteProduct(product_id);
      if (deleteProductResult) {
        return res.status(200).json("Deleted product successfully");
      } else {
        return res.status(500).json("Failed to delete product");
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
