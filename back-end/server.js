const SignUp = require("./handlers/authentication/SignUp");
const SignIn = require("./handlers/authentication/SignIn");

const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;
app.use(cors());

try {
  app.use(SignUp);
  app.use(SignIn);
} catch (err) {
  console.log("error", err);
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
