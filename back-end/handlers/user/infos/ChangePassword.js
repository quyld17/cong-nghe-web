const { tokenVerification } = require("../../../middlewares/JWT");
const { changePassword, checkPassword } = require("../../../entities/Users");

const Router = require("express");
const r = Router();

r.patch("/password", Router.json(), async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  const { password, new_password } = req.body;
  try {
    if (password === "" || new_password === "") {
      return res.status(400).json("Invalid input");
    }

    const checkPasswordResult = await checkPassword(user_id, password);
    if (checkPasswordResult) {
      const changePasswordResult = await changePassword(
        user_id,
        password,
        new_password
      );
      if (changePasswordResult) {
        return res.status(200).json("Change password successfully");
      } else {
        return res.status(500).json("Failed to change password");
      }
    } else {
      return res.status(400).json("Wrong password");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = r;
