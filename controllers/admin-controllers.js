const Product = require('../models/product-model');
const mongodb = require('mongodb');
const mongoose = require('mongoose');

exports.getAddProductPage = (req, res, next) => { //GETs the add product page
    res.render('admin-views/add-product', {products: Product, docTitle: 'add product', path:'/admin/add-product', isLoggedIn: req.session.isLoggedIn}); 
};

exports.postProduct = (req, res, next) => { //POSTs the product to our product array with key of title
    const title = req.body.title;
    const artist = req.body.artist;
    const imageURL = req.body.imageURL;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({
        title: title, 
        artist: artist, 
        price: price,
        description: description, 
        imageURL: imageURL,
        userId: req.user
    });
    product
        .save()
        .then(result => {
            res.redirect('/admin/admin-product-view');
            console.log("product succesfully created!");
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getAdminProductList = (req, res, next) => { //GETs an admin page with all our products
   Product
        .find()
        .then(products => {
            res.render('admin-views/admin-product-view', {products: products, docTitle: 'product management', path: '/admin/admin-product-view', isLoggedIn: req.session.isLoggedIn}); //looks for .pug files & passes our products array
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProductPage = (req, res, next) => { //GETs an edit page with a specific product ID    
    const id = req.params.id;
    Product
        .findById(id)
        .then(foundProduct => {
            if (!foundProduct) {
                return res.redirect('/admin/admin-product-view');
            }
        res.render('admin-views/edit-product', {foundProduct: foundProduct, docTitle: 'edit product', path: '/admin/edit-product/', isLoggedIn: req.session.isLoggedIn});
        })
        .catch(err => console.log(err)); 
    };

exports.postEditedProduct = (req, res, next) => {
    const id = req.body.id;
    const updatedTitle = req.body.title;
    const updatedArtist = req.body.artist;
    const updatedURL = req.body.imageURL;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    Product
        .findById(id)
        .then(product => {
            product.title = updatedTitle;
            product.artist = updatedArtist;
            product.imageURL = updatedURL;
            product.description = updatedDescription;
            product.price = updatedPrice;
            return product
            .save()
            .then(result => {
                console.log("succesfully updated product!");
                res.redirect('/admin/admin-product-view');
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.id;
    const userId = req.user._id;
    console.log(userId);
    Product.deleteOne({_id: prodId})
        .then(() => {
            console.log('product succesfully deleted!');
            res.redirect('/admin/admin-product-view');
        })
        .catch(err => console.log(err));
}; 