const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors'); 

const sequelize = require('./data/database'); // reaches out to our sequelize db

app.use(bodyParser.urlencoded({extended: false})); //parses text, forms, json body, etc.
app.use(express.static(path.join(__dirname, 'public'))); //this is where file requests will be forwarded

app.use('/admin', adminRoutes); //prepends /admin to the route paths in this file
app.use(shopRoutes); 

app.use(errorController.get404);

sequelize
    .sync()
    .then(result => { //calls all the models we've defined and syncs to db
        app.listen(3000); 
    })
    .catch(err => {
        console.log(err);
    }); 

