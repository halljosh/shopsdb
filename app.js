const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');

const adminRoutes = require('./routes/admin'); 
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/errors'); 

const sequelize = require('./data/database'); // reaches out to our sequelize db

const Product = require('./models/product-model');
const User = require('./models/user-model');
const Cart = require('./models/cart-model');
const CartItem = require('./models/cart-item-model');
const Order = require('./models/order-model');
const OrderItem = require('./models/order-item-model');

app.use(bodyParser.urlencoded({extended: false})); //parses text, forms, json body, etc.
app.use(express.static(path.join(__dirname, 'public'))); //this is where file requests will be forwarded

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes); //prepends /admin to the route paths in this file
app.use(shopRoutes); 

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'}); //defines our model relations
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});

sequelize 
    //.sync({ force: true }) //REMOVE BEFORE PRODUCTION!!!
    .sync() //calls all the models we've defined and syncs to db
    .then(result => { 
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Josh', email: 'test@test.com'});
        }
        return Promise.resolve(user);
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000); 
    })
    .catch(err => {
        console.log(err);
    }); 

