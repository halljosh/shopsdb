const Product = require('../models/product');

exports.getAddProductPage = (req, res, next) => { //GETs the add product page
    res.render('add-product', {products: Product, docTitle: 'add product', path:'/admin/add-product'});
    };

exports.postProduct = (req, res, next) => { //POSTs the product to our product array with key of title
    const newProduct = new Product(req.body.title); //creates a new product based on our model
    newProduct.save(); //saves current product to our array
    res.redirect('/'); //sends back home
    };

    exports.getProducts = (req, res, next) => { //GETs a page with all our products
    Product.fetchAll(products => { //fetches our entire list of products
        res.render('shop', {products: products, docTitle: 'Shop', path: '/'}); //looks for .pug files & passes our products array
    }); 
};