const { tokenVerification } = require("../../../middlewares/JWT");
const { deleteProductFromCart } = require("../../../entities/Cart");

const Router = require("express");
const r = Router();

r.delete("/:id", Router.json(), async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  const product_id = req.params.id;
  try {
    if (!product_id) {
      return res.status(400).json("Invalid input");
    }

    const deleteProductFromCartResult = await deleteProductFromCart(
      user_id,
      product_id
    );
    if (deleteProductFromCartResult) {
      return res.status(200).json("Deleted product successfully");
    } else {
      return res.status(500).json("Failed to delete product");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = r;
