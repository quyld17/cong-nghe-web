const SignUp = require("./handlers/authentication/SignUp");
const SignIn = require("./handlers/authentication/SignIn");

const AdminGetProducts = require("./handlers/admin/products/Get");
const AdminDeleteProduct = require("./handlers/admin/products/Delete");
const AdminCreateProduct = require("./handlers/admin/products/Create");
const AdminUpdateProduct = require("./handlers/admin/products/Update");

const AdminCreateCategory = require("./handlers/admin/categories/Create");

const AdminUpdateOrder = require("./handlers/admin/orders/Update");

const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000;
app.use(cors());

try {
  app.use(SignUp);
  app.use(SignIn);

  app.use("/admin", AdminGetProducts);
  app.use("/admin", AdminDeleteProduct);
  app.use("/admin", AdminCreateProduct);
  app.use("/admin", AdminUpdateProduct);

  app.use("/admin", AdminCreateCategory);

  app.use("/admin", AdminUpdateOrder);
} catch (err) {
  console.log("error", err);
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
