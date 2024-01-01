const { tokenVerification } = require("../../../middlewares/JWT");
const {
  placeOrder,
  checkValidProductQuantity,
} = require("../../../entities/Orders");

const Router = require("express");
const r = Router();

r.put("/", Router.json(), async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  const { in_cart, payment_method, address_id, products } = req.body;
  try {
    if (!products) {
      return res.status(400).json("Invalid input");
    }
    const checkValidProductQuantityResult = await checkValidProductQuantity(
      products
    );
    if (checkValidProductQuantityResult !== null) {
      return res
        .status(400)
        .json(
          `Insufficient quantity for product ${checkValidProductQuantityResult}`
        );
    }

    const placeOrderResult = await placeOrder(
      user_id,
      payment_method,
      address_id,
      products,
      in_cart
    );
    if (placeOrderResult) {
      return res.status(200).json("Placed order successfully");
    } else {
      return res.status(500).json("Failed to place order");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = r;
