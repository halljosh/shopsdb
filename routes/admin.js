const path = require('path');

const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => { //only triggers for incoming GET requests
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
  });

router.post('/add-product', (req, res, next) => { //only triggers for incoming POST requests
    console.log(req.body);
    res.redirect('/'); //sends back home
});

module.exports = router;