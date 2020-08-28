const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'pug');

const adminData = require('./routes/admin'); //routes consts contained in these files
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false})); //parses text, forms, json body, etc.
app.use(express.static(path.join(__dirname, 'public'))); //this is where file requests will be forwarded

app.use('/admin', adminData.routes); //prepends /admin to the route paths in this file
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404'); //generic 404 error message
});

app.listen(3000); 