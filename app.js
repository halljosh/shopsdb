const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/errors'); 
const mongoConnect = require('./data/database').mongoConnect;
const User = require('./models/user-model');

app.use(bodyParser.urlencoded({extended: false})); //parses text, forms, json body, etc.
app.use(express.static(path.join(__dirname, 'public'))); //this is where file requests will be forwarded

app.use((req, res, next) => {
    User.findById("5f568455a28296eda3468190")
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes); //prepends /admin to the route paths in this file
app.use(shopRoutes); 

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});

