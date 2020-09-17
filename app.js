const path = require('path');
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf')
const flash = require('connect-flash');

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

const csrfProtect = csrf();

app.set('view engine', 'pug');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/errors'); 
const User = require('./models/user-model');

app.use(bodyParser.urlencoded({extended: false})); //parses text, forms, json body, etc.
app.use(express.static(path.join(__dirname, 'public'))); //this is where file requests will be forwarded
app.use(session({secret: 'westrock elephant', resave: false, saveUninitialized: false, store: store}))

app.use(csrfProtect);
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            throw new Error(err);
        });  
});

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes); //prepends /admin to the route paths in this file
app.use(shopRoutes); 
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(process.env.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        app.listen(process.env.PORT || 3000);
        console.log('successfully connected to mongodb!')
    })
    .catch(err => {
        console.log(err);
    });  


