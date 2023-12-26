const { tokenVerification } = require("../../../middlewares/JWT");
const { verifyAdmin } = require("../../../entities/Users");
const {
  createCategory,
  checkCategoryExist,
} = require("../../../entities/Categories");

const Router = require("express");
const r = Router();

r.put("/category", Router.json(), async (req, res) => {
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

  const { category_name } = req.body;
  if (category_name !== "") {
    try {
      const categoryAlreadyExisted = await checkCategoryExist(category_name);
      if (categoryAlreadyExisted) {
        return res.status(400).json("Category already existed");
      }
      const createCategoryResult = await createCategory(category_name);
      if (createCategoryResult) {
        return res.status(200).json("Created category successfully");
      } else {
        return res.status(500).json("Failed to create category");
      }
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json("Internal Server Error");
    }
  } else {
    return res.status(400).json("No input");
  }
});

module.exports = r;
