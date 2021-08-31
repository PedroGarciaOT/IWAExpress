const { request } = require('express');
const express = require('express');
const router = express.Router();
const config = require('config');

const appConf = config.get('App');

// shopping cart
router.get('/', function(request, response) {
    response.render('cart/index', {
        title: appConf.name + " :: Cart"
    });
});

// shopping cart checkout
router.get('/checkout', function (request, response) {
    response.render('cart/checkout', {
        title: appConf.name + " :: Checkout"
    });
});

// shopping cart checkout
router.get('//confirm', function (request, response) {
    response.render('cart/confirm', {
        title: appConf.name + " :: Confirmation"
    });
});


module.exports = router;
