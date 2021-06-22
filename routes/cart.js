const { request } = require('express');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection  = require('../lib/db');

const APP_TITLE = "IWAExpress"

// shopping cart
router.get('/', function(request, response) {
    response.render('cart/index', {
        title: APP_TITLE + " :: Cart"
    });
});

module.exports = router;
