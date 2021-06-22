'use strict';

const APP_PORT = 3000;
const APP_TITLE = "ExpressIWA";

const express = require("express");
const config = require('config');
const router = express.Router();
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors')
const debug = require('debug');
const favicon = require('serve-favicon');


// any command line args
var myArgs = process.argv.slice(2);
if (myArgs.length > 0) {
    console.log("User supplied arguments:");
    console.log(myArgs);
}

const app = express();

app.use(logger('common'));
//app.use(express.csrf());
//app.use(express.methodOverride());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome/'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(flash());

// use ejs templates in "views" subdirectory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default app configuration
const appConf = config.get('App');
app.locals = {
    api: { url: appConf.apiConfig.url }
};

// add username to "locals" if found in session
app.use(function (req, res, next) {
    if (req.session && req.session.username) {
        res.locals.username = req.session.username;
    } else {
        // no session found
    }
    next();
});

// application routes
app.use('/', require('./routes/default'));
app.use('/product', require('./routes/product'));
app.use('/user', require('./routes/user'));
app.use('/cart', require('./routes/cart'));
app.use('/api', require('./routes/api'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.status = err.status;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        title: APP_TITLE + " :: Error"
    });
});

app.listen(APP_PORT, () =>
    console.log(`Express server listening on port ${APP_PORT}`)
);

module.exports = app;

