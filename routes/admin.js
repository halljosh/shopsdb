const path = require('path');

const express = require('express');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => { //only triggers for incoming GET requests
    res.render('add-product', {products: products, docTitle: 'add product', path:'/admin/add-product'});
  });

router.post('/add-product', (req, res, next) => { //only triggers for incoming POST requests
    products.push({title: req.body.title});
    res.redirect('/'); //sends back home
});

exports.routes = router;
exports.products = products;