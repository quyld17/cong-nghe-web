const { signIn } = require("../../entities/SignIn");
const { getUserIdByEmail, getRole } = require("../../entities/Users");
const { secretKey } = require("../../services/JWT");

const Router = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
const r = Router();

r.post("/sign-in", express.json(), async (req, res) => {
  const account = req.body;
  if (account) {
    try {
      if (account.email === "" || account.password === "") {
        return res.status(400).json("Invalid input");
      }

      const signInResult = await signIn(account);
      if (signInResult) {
        const user_id = await getUserIdByEmail(account.email);
        const role = await getRole(account.email);
        const token = jwt.sign({ user_id: user_id, role: role }, secretKey, {
          expiresIn: "24h",
        });
        return res.status(200).json({ jwt: token });
      } else {
        return res
          .status(400)
          .json("Wrong email or password. Please try again");
      }
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = r;
