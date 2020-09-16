const Product = require('../models/product-model');
const Order = require('../models/order-model');

exports.getProducts = (req, res, next) => { //GETs a page with all our products
    Product.find()
   .then(products => {
    res.render('customer-views/product-list', {products: products, docTitle: 'shop', path: '/shop', isLoggedIn: req.session.isLoggedIn}); //looks for .pug files & passes our products array
   })
   .catch(err => {
       console.log(err); 
   });
}

exports.getHome = (req, res, next) => { //GETs home page
    Product.find()
        .then(([rows, fieldData]) => {
            res.render('customer-views/index', {docTitle: 'primary record shop', path: '/', products: rows, isLoggedIn: req.session.isLoggedIn})
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => { //GETs cart page
    req.user
        .populate('cart.items.productId')
        .execPopulate() //returns a promise
        .then(user => {
                const products = user.cart.items;
                let totalPrice = 0; 
                const getTotal = () => {
                    for (let i = 0; i < products.length; i++) {
                        totalPrice = totalPrice + (products[i].productId.price * products[i].quantity); 
                    }   return totalPrice;
                }   
                res.render('customer-views/cart', {docTitle: 'cart', path: '/cart', products: products, isLoggedIn: req.session.isLoggedIn, total: getTotal()});
            })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => { //POSTs selected product to cart
    const id = req.body.id; 
    Product
        .findById(id)
        .then(product => {
            if (!req.user) {
                return res.redirect('/login');
            }
            else {
                return req.user.addToCart(product);
            }
        })
        .then(result => {
            if(result) {
                res.redirect('/cart');
            }
        })
        .catch(err => {
            console.log(err);
        });
    }
    
exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.id;
    console.log(productId)
    req.user
        .deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate() //returns a promise
        .then(user => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: { ...i.productId._doc }} //this structure mirrors our order model
            });
            const order = new Order({
                user: {
                    username: req.user.username,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect('/checkout');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCheckout = (req, res, next) => { //GETs unique orders page
    Order.find({ "user.userId": req.user._id})
    .then(orders => {
        res.render('customer-views/checkout', {orders: orders, docTitle: 'orders', path: '/orders', isLoggedIn: req.session.isLoggedIn });
    })
    .catch(err => console.log(err));
};  
