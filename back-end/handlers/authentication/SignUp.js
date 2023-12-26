const { isUserAlreadyRegistered, signUp } = require("../../entities/SignUp");

const Router = require("express");
const express = require("express");
const r = Router();

r.post("/sign-up", express.json(), async (req, res) => {
  const account = req.body;
  if (account) {
    try {
      if (account.password === "" || account.email === "") {
        return res.status(400).json("Invalid input");
      }

      const userAlreadyExisted = await isUserAlreadyRegistered(account.email);
      if (userAlreadyExisted) {
        return res.status(400).json("User already registered");
      }

      const role = "user";
      const userSignUpResult = await signUp(
        account.email,
        account.password,
        role
      );
      if (userSignUpResult) {
        return res.status(200).json("User registered successfully");
      } else {
        return res.status(500).json("Failed to register user");
      }
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json("Internal Server Error");
    }
  }
});

module.exports = r;
