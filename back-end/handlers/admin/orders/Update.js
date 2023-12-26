const { tokenVerification } = require("../../../middlewares/JWT");
const { verifyAdmin } = require("../../../entities/Users");
const { updateOrderStatus } = require("../../../entities/Orders");

const Router = require("express");
const r = Router();

r.patch("/order/:id", Router.json(), async (req, res) => {
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

  const { status } = req.body;
  const order_id = req.params.id;
  if (status !== "" && order_id !== null) {
    try {
      const updateOrderStatusResult = await updateOrderStatus(status, order_id);
      if (updateOrderStatusResult) {
        return res.status(200).json("Updated status successfully");
      } else {
        return res.status(500).json("Failed to update status");
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
