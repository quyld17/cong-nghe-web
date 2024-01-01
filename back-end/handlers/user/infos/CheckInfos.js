const { tokenVerification } = require("../../../middlewares/JWT");
const { getUserInfos, checkAddress } = require("../../../entities/Users");

const Router = require("express");
const r = Router();

r.post("/", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  try {
    const infos = await getUserInfos(user_id);
    if (
      infos.full_name === null ||
      infos.date_of_birth === null ||
      infos.phone_number === null ||
      infos.gender === null
    ) {
      return res.status(400).json("Please update your infos");
    }

    const address = await checkAddress(user_id);
    if (address === 0) {
      return res.status(400).json("Please update your address");
    }

    return res.status(200).json("Your profile is fully set up");
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = r;
