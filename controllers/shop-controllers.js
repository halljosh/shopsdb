const Product = require('../models/product-model');

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
    req.user
        .getCart()
        .then(cart => {
            return cart
                .getProducts()
                .then(products => {
                    res.render('customer-views/cart', {docTitle: 'Cart', path: '/cart', products: products});
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => { //POSTs selected product to cart
    const id = req.body.id;
    let newQty = 1;
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: id}})
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
               const oldQuantity = product.cartItem.quantity;
               newQty = oldQuantity + 1;
               return product;
            }
            return Product.findByPk(id);
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQty }});
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const id = req.body.id;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: {id: id}});
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                        })
                    );
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/checkout');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCheckout = (req, res, next) => { //GETs unique orders page
    req.user
        .getOrders({include: ['products']}) //allows access to products key in checkout.pug
        .then(orders=> {
            res.render('customer-views/checkout', {orders: orders, docTitle: 'orders', path: '/orders' });
        })
        .catch(err => console.log(err));
};