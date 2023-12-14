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

app.listen(port, () => {
    console.log(`Website running on port ${port}`);
  });

