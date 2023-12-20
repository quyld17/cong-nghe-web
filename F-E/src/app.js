const express = require("express");
const path = require('path');
const configViewEngine = require('./config/viewEngine');
const homeController = require('./controllers/homeController');


const app = express();
const port = 1234;

configViewEngine(app);



app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())

app.post('/checkdata', homeController.checkData);

app.get('/', homeController.getCheck);

app.get('/check/:token', homeController.postCheck);

app.get('/products', homeController.getProductsAdmin);

app.get('/orders', homeController.getOrdersAdmin);

app.get('/customer', homeController.getCustomerAdmin);

app.get('/sign-up', homeController.getSignUpPage);

app.get('/sign-in', homeController.getSignInPage);

app.get('/products/newProduct', homeController.creatProduct);

app.get('/product/:id', homeController.getDetailProductPage);

app.get('/category/:id', homeController.getProductSearchCategory);

app.get('/order/:id', homeController.getDetailOrder);

app.get('/customer/:id', homeController.getDetailCustomer);

app.get('/orders/search/:key', homeController.searchOrders);

app.get('/products/search/:key', homeController.searchProducts);

app.get('/customers/search/:key', homeController.searchCustomers);

app.get('/customer/:id/orders', homeController.orderOfCustomer);

app.listen(port, () => {
    console.log(`Website running on port ${port}`);
  });

 