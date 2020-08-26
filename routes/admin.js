const path = require('path');

const express = require('express');

const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => { //only triggers for incoming GET requests
    res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));
  });

router.post('/add-product', (req, res, next) => { //only triggers for incoming POST requests
    products.push({title: req.body.title});
    res.redirect('/'); //sends back home
});

exports.routes = router;
exports.products = products;