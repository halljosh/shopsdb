const path = require('path');

const express = require('express');

const adminControllers = require('../controllers/admin-controllers'); //allows access to products controller functions

const router = express.Router();

router.get('/add-product', adminControllers.getAddProductPage);

router.post('/add-product', adminControllers.postProduct);

router.get('/admin-product-view', adminControllers.getAdminProductList);

router.get('/edit-product/:id', adminControllers.getEditProductPage); //the colon signifies that everything following is a variable

router.post('/edit-product', adminControllers.postEditedProduct);

router.post('/delete-product', adminControllers.deleteProduct);

module.exports = router;