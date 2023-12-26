const { tokenVerification } = require("../../middlewares/JWT");

const Router = require("express");
const r = Router();

r.put("/add-product", Router.json(), async (req, res) => {
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

    const addProductToCartResult = addProductToCart(user_id, product);
    if (addProductToCartResult) {
      return res.status(200).json("Added product to cart successfully");
    } else {
      return res.status(500).json("Failed to add product to cart");
    }
  } catch (error) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = r;
