const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'pug');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/errors'); 
const User = require('./models/user-model');

app.use(bodyParser.urlencoded({extended: false})); //parses text, forms, json body, etc.
app.use(express.static(path.join(__dirname, 'public'))); //this is where file requests will be forwarded

app.use((req, res, next) => {
    User.findById("5f57cc4d28e4502ee8ced56c")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes); //prepends /admin to the route paths in this file
app.use(shopRoutes); 

app.use(errorController.get404);

mongoose
    .connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Toast',
                    email: 'toast@corgis.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
        console.log('succesfully connected to mongodb!')
    })
    .catch(err => {
        console.log(err);
    });  


