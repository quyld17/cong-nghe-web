const { tokenVerification } = require("../../../middlewares/JWT");
const { updateUserDetails } = require("../../../entities/Users");

const Router = require("express");
const r = Router();

r.patch("/details", Router.json(), async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  const user = req.body;
  if (user) {
    try {
      if (
        user.full_name === "" ||
        user.date_of_birth === "" ||
        user.phone_number === "" ||
        user.gender === null
      ) {
        return res.status(400).json("Invalid input");
      }
      const updateUserDetailsResult = await updateUserDetails(user, user_id);
      if (updateUserDetailsResult) {
        return res.status(200).json("Updated user details successfully");
      } else {
        return res.status(500).json("Failed to update user details");
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
