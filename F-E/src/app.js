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

app.get('/home', homeController.getHomePage);

app.get('/filter/category/:categoryId', homeController.getFilterPage);

app.get('/search/products/:key', homeController.searchProductsPage);

app.get('/check/:token', homeController.checkRole);

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



app.get('/user/:userId/product/:productId', homeController.detailProductUser);

app.get('/user/:userId/search/products/:key', homeController.searchUserProducts);

app.get('/user/:userId/category/:categoryId', homeController.getFilterProductPage)

app.get('/user/:userId/profile', homeController.getUserProfile);

app.get('/user/:userId/cart', homeController.getCartUserPage);

app.get('/user/:userId/create-order', homeController.creatOrder);

app.get('/user/:userId/orders', homeController.orderUserPage);

app.listen(port, () => {
    console.log(`Website running on port ${port}`);
  });

 