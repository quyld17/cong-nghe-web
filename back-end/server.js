const SignUp = require("./handlers/authentication/SignUp");
const SignIn = require("./handlers/authentication/SignIn");

const AdminGetProducts = require("./handlers/admin/products/Get");
const AdminDeleteProduct = require("./handlers/admin/products/Delete");
const AdminCreateProduct = require("./handlers/admin/products/Create");
const AdminUpdateProduct = require("./handlers/admin/products/Update");

const AdminCreateCategory = require("./handlers/admin/categories/Create");
const AdminUpdateOrder = require("./handlers/admin/orders/Update");

const UserDetails = require("./handlers/user/infos/UpdateInfos");
const UserChangePassword = require("./handlers/user/infos/ChangePassword");
const UserCreateAddress = require("./handlers/user/infos/Address");
const UserCheckProfile = require("./handlers/user/infos/CheckInfos");

const UserAddProductToCart = require("./handlers/user/cart/AddProduct");
const UserDeleteProductFromCart = require("./handlers/user/cart/DeleteProduct");
const UserUpdateProductQuantity = require("./handlers/user/cart/UpdateQuantity");

const UserPlaceOrder = require("./handlers/user/orders/PlaceOrder");
const UserCancelOrder = require("./handlers/user/orders/CancelOrder");

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

  app.use("/user", UserDetails);
  app.use("/user", UserChangePassword);
  app.use("/user", UserCreateAddress);
  app.use("/user", UserCheckProfile);

  app.use("/user/cart", UserAddProductToCart);
  app.use("/user/cart", UserDeleteProductFromCart);
  app.use("/user/cart", UserUpdateProductQuantity);

  app.use("/user/order", UserPlaceOrder);
  app.use("/user/order", UserCancelOrder);
} catch (err) {
  console.log("error", err);
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
