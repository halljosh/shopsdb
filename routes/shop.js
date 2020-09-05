const path = require('path');

const express = require('express');

const shopControllers = require('../controllers/shop-controllers'); //allows access to products controller functions

const router = express.Router();

router.get('/', shopControllers.getProducts);

router.get('/home', shopControllers.getHome);

router.get('/cart', shopControllers.getCart);

router.post('/cart', shopControllers.postCart);

router.post('/cart-delete-item', shopControllers.postCartDeleteProduct);

router.get('/checkout', shopControllers.getCheckout);

router.post('/checkout', shopControllers.postOrder);

module.exports = router;