const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors'); 

app.use(bodyParser.urlencoded({extended: false})); //parses text, forms, json body, etc.
app.use(express.static(path.join(__dirname, 'public'))); //this is where file requests will be forwarded

app.use('/admin', adminRoutes); //prepends /admin to the route paths in this file
app.use(shopRoutes); 

app.use(errorController.get404);

app.listen(3000); 