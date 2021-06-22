const { request } = require('express');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection  = require('../lib/db');

const APP_TITLE = "IWAExpress"

// product home
router.get('/', function (request, response) {

    console.log(`INFO: Request for /product received`);
    response.render('product/index', {
        title: APP_TITLE + " :: Products"
    });

});

// search request
/*router.get('/search',function(request, response) {
    const keywords = request.query.keywords;
    console.log(`INFO: Searching for keywords: ${keywords}`);

    connection.query("SELECT BIN_TO_UUID(id) AS uuid, name, image, summary, price, rating FROM products WHERE name LIKE '%" + request.query.keywords + "%'", function (error, results, fields) {
        if (error) {
            return response.sendStatus(500)
        } else {
            response.json(results)
        }
    });

});*/

// product details
router.get('/:pid', function (request, response) {

    const productId = request.params.pid;
    console.log(`INFO: Viewing product id: ${productId}`);

    connection.query("SELECT BIN_TO_UUID(id) AS uuid, code, name, image, summary, description, price, rating, on_sale as onSale, sale_price as salePrice, in_stock as inStock, time_to_stock as timeToStock " + 
        "FROM products WHERE id = UUID_TO_BIN('" + productId + "')", function (error, results, fields) {
            if (results != undefined && results.length > 0) {
                response.render('product/view', { 
                    title: APP_TITLE + " :: Product",
                    product: results[0]
                });
            } else {
                request.flash('error', 'Cannot view product id: ' + productId);
                response.redirect('/');
            }		
    });
   
});

module.exports = router;
