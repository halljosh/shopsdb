const path = require('path');

const express = require('express');

const productsController = require('../controllers/products'); //allows access to products controller functions

const router = express.Router();

router.get('/add-product', productsController.getAddProductPage);

router.post('/add-product', productsController.postProduct);

module.exports = router;