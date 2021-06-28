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

module.exports = router;
