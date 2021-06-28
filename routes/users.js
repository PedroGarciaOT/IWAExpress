const { request } = require('express');
const express = require('express');
const router = express.Router();
const config = require('config');

const appConf = config.get('App');

// user home
router.get('/', function(request, response) {
    response.render('users/index', {
        title: appConf.name + " :: User"
    });
});

module.exports = router;
