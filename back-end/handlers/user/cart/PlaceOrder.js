const { tokenVerification } = require("../../../middlewares/JWT");
const { placeOrder } = require("../../../entities/Orders");

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

  const { payment_method, address_id, products } = req.body;
  try {
    if (!products) {
      return res.status(400).json("Invalid input");
    }

    const placeOrderResult = await placeOrder(
      user_id,
      payment_method,
      address_id,
      products
    );
    if (placeOrderResult) {
      return res.status(200).json("Place order successfully");
    } else {
      return res.status(500).json("Failed to place order");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = r;
