const express = require("express");
const path = require('path');
const configViewEngine = require('./config/viewEngine');
const homeController = require('./controllers/homeController');

const app = express();
const port = 1234;

configViewEngine(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', homeController.getAdminPage);

app.get('/products', homeController.getProductsAdmin);

app.get('/orders', homeController.getOrdersAdmin);

app.get('/customer', homeController.getCustomerAdmin);

app.get('/sign-up', homeController.getSignUpPage);

app.get('/sign-in', homeController.getSignInPage);

app.listen(port, () => {
    console.log(`Website running on port ${port}`);
  });

