const path = require('path');

const express = require('express');

const shopControllers = require('../controllers/shop-controllers');
const isAuth = require('../controllers/is-auth-middleware');

const router = express.Router();

router.get('/shop', shopControllers.getProducts);

router.get('/', shopControllers.getHome);

router.get('/cart', isAuth, shopControllers.getCart);

router.post('/cart', shopControllers.postCart);

router.post('/cart-delete-item', shopControllers.postCartDeleteProduct);

router.get('/checkout', isAuth, shopControllers.getCheckout);

router.post('/checkout', shopControllers.postOrder);

module.exports = router;