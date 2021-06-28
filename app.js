'use strict';

const express = require("express");
const config = require('config');
const router = express.Router();
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
const debug = require('debug');
const cors = require('cors');
const favicon = require('serve-favicon');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const errorHandler = require('./middleware/error-handler');
const basicAuthHandler = require("./middleware/basic-auth-handler");

//const cors = require("./middleware/authCors");

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
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

// use basic authentication handler for API authorisation
app.use(basicAuthHandler);

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
app.use('/products', require('./routes/products'));
app.use('/users', require('./routes/users'));
app.use('/cart', require('./routes/cart'));

// Swagger API Configuration  
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'IWAExpress API',
            version: '1.0.0',
            description:
                "This is the API for IWAExpress (Insecure Web App) Pharmacy Direct an insecure NodeJS/Express web application documented with Swagger",
            license: {
                name: "GPLv3",
                url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
            },
            contact: {
                name: "Micro Focus",
                url: "https://microfocus.com",
                email: "info@microfocus.com",
            }
        },
        components: {
            securitySchemes: {
                basicAuth: {
                    type: 'http',
                    scheme: 'basic',
                    description: 'Basic Authorization header.',
                },
            },
        },
        security: [
            {
                basicAuth: [],
            },
        ],
        servers: [
            {
                url: "https://iwaexpress.mfdemouk.com/api",
                description: 'Production instance'
            },
            {
                url: "http://localhost:3000/api",
                description: 'Development server'
            },
        ],
    },
    apis: ['./routes/api/*.js'],
    securityDefinitions: {
        auth: {
            type: 'basic',
        },
    },
    security: [{ auth: [] }],
}
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// application api routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, { explorer: true }));
app.use('/api/site', require('./routes/api/site'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/cart', require('./routes/api/cart'));

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
        title: appConf.title + " :: Error"
    });
});

app.listen(appConf.port, () =>
    console.log(`Express server listening on port ${appConf.port}`)
);

module.exports = app;

