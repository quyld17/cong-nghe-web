const { tokenVerification } = require("../../../middlewares/JWT");
const {
  updateProductQuantity,
  deleteProductFromCart,
} = require("../../../entities/Cart");

const Router = require("express");
const r = Router();

r.patch("/", Router.json(), async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  const product = req.body;
  try {
    if (product.product_id === null || product.quantity === null) {
      return res.status(400).json("Invalid input");
    }

    if (product.quantity <= 0) {
      const deleteProductFromCartResult = await deleteProductFromCart(
        user_id,
        product.product_id
      );
      if (deleteProductFromCartResult) {
        return res.status(200).json("Deleted product successfully");
      } else {
        return res.status(500).json("Failed to delete product");
      }
    } else {
      const updateProductQuantityResult = await updateProductQuantity(
        user_id,
        product
      );
      if (updateProductQuantityResult) {
        return res.status(200).json("Updated quantity successfully");
      } else {
        return res.status(500).json("Failed to update quantity");
      }
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = r;
