const Product = require('../models/product-model');
const Cart = require('../models/cart-model');

exports.getProducts = (req, res, next) => { //GETs a page with all our products
    Product.findAll()
   .then(products => {
    res.render('customer-views/product-list', {products: products, docTitle: 'Shop', path: '/'}); //looks for .pug files & passes our products array
   })
   .catch(err => {
       console.log(err);
   });
}

exports.getHome = (req, res, next) => { //GETs home page
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('customer-views/index', {docTitle: 'Home', path: '/home', products: rows})
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => { //GETs cart page
    Cart.getCartContents(cart => {
        Product.fetchAll(products => {
            const finalCart = [];
            for (product of products) {
                const cartData = cart.products.find(p => p.id === product.id);
                if (cartData) {
                    finalCart.push({product: product, qty: cartData.qty});
                }
            }
            res.render('customer-views/cart', {docTitle: 'Cart', path: '/cart', products: finalCart});
        });
    });
};

exports.postCart = (req, res, next) => { //POSTs selected product to cart
    const id = req.body.id;
    Product.searchId(id, product => {
        Cart.addProduct(id, product.price);
    });
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.searchId(id, price => {
        Cart.deleteCartItem(id, price);
        res.redirect('/cart');
    });
};

exports.getCheckout = (req, res, next) => { //GETs checkout page
    res.render('customer-views/checkout', {docTitle: 'Checkout', path: '/checkout' })
}; 

//post checkout