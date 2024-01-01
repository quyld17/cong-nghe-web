const { tokenVerification } = require("../../../middlewares/JWT");
const { updateOrderStatus } = require("../../../entities/Orders");

const Router = require("express");
const r = Router();

r.patch("/:id", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  const order_id = req.params.id;
  try {
    if (!order_id) {
      return res.status(400).json("Invalid input");
    }

    const cancelOrderStatusResult = await updateOrderStatus(
      "Cancelled",
      order_id
    );
    if (cancelOrderStatusResult) {
      return res.status(200).json("Cancelled order successfully");
    } else {
      return res.status(500).json("Failed to cancel order");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = r;
