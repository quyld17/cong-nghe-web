const { isUserAlreadyRegistered, signUp } = require("../../entities/SignUp");

const Router = require("express");
const express = require("express");
const r = Router();

r.post("/sign-up", express.json(), async (req, res) => {
  const account = req.body;
  if (account) {
    try {
      if (
        account.password === "" ||
        account.mail === "" ||
        account.auth_method === ""
      ) {
        return res.status(400).json("Invalid input");
      }

      const userAlreadyExisted = await isUserAlreadyRegistered(account.mail);
      if (userAlreadyExisted) {
        return res.status(400).json("User already registered");
      }

      const role = "user";
      let user_name = "";
      for (let i = 0; i < account.mail.length; i++) {
        if (account.mail[i] === "@") {
          break;
        }
        user_name += account.mail[i];
      }

      const userSignUpResult = await signUp(
        user_name,
        account.password,
        account.mail,
        role,
        account.auth_method
      );
      if (userSignUpResult) {
        res.status(200).json("User registered successfully");
      } else {
        res.status(500).json("Failed to register user");
      }
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = r;
