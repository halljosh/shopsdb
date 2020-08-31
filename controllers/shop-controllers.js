
const Product = require('../models/product-model');
const Cart = require('../models/cart-model');

exports.getProducts = (req, res, next) => { //GETs a page with all our products
    Product.fetchAll(products => { //fetches our entire list of products
        res.render('customer-views/product-list', {products: products, docTitle: 'Shop', path: '/'}); //looks for .pug files & passes our products array
    }); 
};

exports.getHome = (req, res, next) => { //GETs home page
    res.render('customer-views/index', {docTitle: 'Home', path: '/home'})
};

exports.getCart = (req, res, next) => { //GETs cart page
    res.render('customer-views/cart', {docTitle: 'Cart', path: '/cart'})
};

exports.postCart = (req, res, next) => { //POSTs selected product to cart
    const id = req.body.id;
    Product.searchId(id, (product) => {
        Cart.addProduct(id, product.price);
    });
    res.redirect('/cart');
};

exports.getCheckout = (req, res, next) => { //GETs checkout page
    res.render('customer-views/checkout', {docTitle: 'Checkout', path: '/checkout' })
}; 

//post checkout