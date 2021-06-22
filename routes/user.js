const { request } = require('express');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection  = require('../lib/db');

const APP_TITLE = "IWAExpress"

// user home
router.get('/', function(request, response) {
    response.render('user/index', {
        title: APP_TITLE + " :: User"
    });
});

module.exports = router;
