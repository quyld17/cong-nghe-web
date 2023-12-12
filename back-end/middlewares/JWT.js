const { secretKey } = require("../services/JWT");

const jwt = require("jsonwebtoken");

async function tokenVerification(token, res) {
  if (!token) {
    return res.status(400).json("Unauthorized");
  }
  const decodedToken = jwt.verify(token, secretKey);

  try {
    if (!decodedToken.user_id) {
      return res.status(401).json("User not found");
    }
    return decodedToken.user_id;
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
}

module.exports = {
  tokenVerification,
};
