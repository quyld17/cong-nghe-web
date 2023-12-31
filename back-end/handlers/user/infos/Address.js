const { tokenVerification } = require("../../../middlewares/JWT");
const {
  createAddress,
  checkExistedAddress,
  deleteAddress,
  checkDefaultAddress,
  setDefaultAddress,
} = require("../../../entities/Users");

const Router = require("express");
const r = Router();

r.put("/address", Router.json(), async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  const address = req.body;
  try {
    if (
      address.city === "" ||
      address.district === "" ||
      address.ward === "" ||
      address.street == "" ||
      address.house_number == ""
    ) {
      return res.status(400).json("Invalid input");
    }

    let is_default = 1;
    const checkExistedAddressResult = await checkExistedAddress(user_id);
    if (checkExistedAddressResult) {
      is_default = 0;
    }

    const createAddressResult = await createAddress(
      user_id,
      address,
      is_default
    );
    if (createAddressResult) {
      return res.status(200).json("Create address successfully");
    } else {
      return res.status(500).json("Failed to create address");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

r.delete("/address/:id", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  const address_id = req.params.id;
  try {
    if (address_id === null) {
      return res.status(400).json("Invalid input");
    }

    const checkDefaultAddressResult = await checkDefaultAddress(
      user_id,
      address_id
    );
    if (checkDefaultAddressResult) {
      return res.status(400).json("Can not delete default address");
    }
    const deleteAddressResult = await deleteAddress(user_id, address_id);
    if (deleteAddressResult) {
      return res.status(200).json("Delete address successfully");
    } else {
      return res.status(500).json("Failed to delete address");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

r.patch("/address/:id", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json("Token not found");
  }
  const user_id = await tokenVerification(token, res);
  if (!user_id) {
    return res.status(401).json("Failed to authorize user");
  }

  const address_id = req.params.id;
  try {
    if (address_id === null) {
      return res.status(400).json("Invalid input");
    }

    const setDefaultAddressResult = await setDefaultAddress(
      user_id,
      address_id
    );
    if (setDefaultAddressResult) {
      return res.status(200).json("Set default address successfully");
    } else {
      return res.status(500).json("Failed to set default address");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json("Internal Server Error");
  }
});

module.exports = r;
