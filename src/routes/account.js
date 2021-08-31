const { request } = require('express');
const express = require('express');
const router = express.Router();
const connection  = require('../lib/db');
const config = require('config');
const appConf = config.get('App');

// user accouunt
router.get('/', function(request, response) {
    const username = request.session.username;
    console.log(`INFO: Viewing user account for: ${username}`);

    connection.query('SELECT BIN_TO_UUID(id) AS id, username, password, email, mobile FROM accounts WHERE username = "' + username + '"', function (error, results, fields) {
            if (results != undefined && results.length > 0) {
                response.render('account/index', { 
                    title: appConf.name + " :: Account",
                    account: results[0]
                });
            } else {
                request.flash('error', 'Cannot view account for username: ' + username);
                response.redirect('/');
            }		
    });
});

module.exports = router;
