const { request } = require('express');
const express = require('express');
const router = express.Router();
const connection  = require('../lib/db');
const config = require('config');
const appConf = config.get('App');

// product home
router.get('/', function (request, response) {

    console.log(`INFO: Request for /product received`);
    response.render('products/index', {
        title: appConf.name + " :: Products"
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
                response.render('products/view', { 
                    title: appConf.name + " :: Product",
                    product: results[0]
                });
            } else {
                request.flash('error', 'Cannot view product id: ' + productId);
                response.redirect('/');
            }		
    });
   
});

var typeCastManager = {
    typeCast: function castField(field, useDefaultTypeCasting) {

        // We only want to cast bit fields that have a single-bit in them. If the field
        // has more than one bit, then we cannot assume it is supposed to be a Boolean.
        if ((field.type === "BIT") && (field.length === 1)) {

            var bytes = field.buffer();

            // A Buffer in Node represents a collection of 8-bit unsigned integers.
            // Therefore, our single "bit field" comes back as the bits '0000 0001',
            // which is equivalent to the number 1.
            return (bytes[0] === 1);

        }

        return (useDefaultTypeCasting());
    }
};

module.exports = router;
