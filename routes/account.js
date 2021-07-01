const { request } = require('express');
const express = require('express');
const router = express.Router();
const config = require('config');

const appConf = config.get('App');

// user accouunt
router.get('/', function(request, response) {
    response.render('account/index', {
        title: appConf.name + " :: Account"
    });
});

module.exports = router;
