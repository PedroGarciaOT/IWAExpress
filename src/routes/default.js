const { request } = require('express');
const express = require('express');
const router = express.Router();
const connection = require('../lib/db');
const config = require('config');

const appConf = config.get('App');

// login request
router.get('/login', (request, response) => {
    console.log(`INFO: Request for login received`);
    response.render('login', { 
        title: appConf.name + " :: Login",
        email: '',
        password: ''
    })
});

// logout request
router.get('/logout', (request, response) => {
    console.log(`INFO: Request for logout received`);
    request.flash('success', 'You have been logged out.');
    request.session.destroy();
    response.redirect('/');
});


// login authorisation request
router.post('/auth', function (request, response) {
    var username = request.body.username
	var email = request.body.email;
	var password = request.body.password;
    if (email && password) {
		connection.query('SELECT * FROM accounts WHERE email = "' + request.body.email + '" AND password = "' + request.body.password + '"', function(error, results, fields) {
            if (!results) {
                request.flash('error', 'Database cannot be read - has it been initialized');
                response.redirect('/login');
            } else {
                if (results.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = results[0].username;
                    response.cookie("username", results[0].username);
                    request.flash('success', 'You have successfully logged in.');
                    response.redirect('/');
                } else {
                    request.flash('error', 'Please enter correct email and password.');
                    response.redirect('/login');
                }
            }    
		});
	} else {
        request.flash('error', 'Please enter an email and password.');
        response.redirect('/login');
	}
});

// home page
router.get('/', (request, response) => {
    console.log(`INFO: Request for / received`);
    if (request.session.loggedin) {
        response.render('home', {
            title: appConf.name + " :: Home"
        });
    } else {
        response.render('home', {
            title: appConf.name + " :: Home"
        });
    }
});

// prescriptions
router.get('/prescriptions', function (request, response) {
    response.render('prescriptions', {
        title: appConf.name + " :: Prescriptions"
    });
});

// services
router.get('/services', function (request, response) {
    response.render('services', {
        title: appConf.name + " :: Services"
    });
});

// advice
router.get('/advice', function (request, response) {
    response.render('advice', {
        title: appConf.name + " :: Advice"
    });
});

module.exports = router;
