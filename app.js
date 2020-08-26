const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false})); //parses text, forms, json body, etc.
app.use(express.static(path.join(__dirname, 'public'))); //this is where file requests will be forwarded

app.use('/admin', adminData.routes); //prepends /admin to the route paths in this file
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); //generic 404 error message
});

app.listen(3000); 