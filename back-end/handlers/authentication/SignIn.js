const { signIn } = require("../../entities/SignIn");
const { getUserNameAndImage } = require("../../entities/Users");
const { secretKey } = require("../../services/JWT");

const Router = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
const r = Router();

r.post("/sign-in", express.json(), async (req, res) => {
  const account = req.body;
  if (account) {
    try {
      if (account.mail === "" || account.password === "") {
        return res.status(400).json("Invalid input");
      }

      const signInResult = await signIn(account);
      if (signInResult) {
        const user_data = await getUserNameAndImage(account.mail);
        const token = jwt.sign(
          { user_name: user_data.user_name, avatar: user_data.image },
          secretKey,
          {
            expiresIn: "24h",
          }
        );
        return res.status(200).json({ jwt: token });
      } else {
        return res
          .status(400)
          .json("Wrong username or password. Please try again");
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = r;
