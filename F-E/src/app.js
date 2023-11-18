const express = require("express");
const path = require('path');
const configViewEngine = require('./config/viewEngine');
const homeController = require('./controllers/homeController');

const app = express();

configViewEngine(app);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', homeController.getAdminPage);

app.get('/products', homeController.getProductsAdmin)

app.listen(1234);

