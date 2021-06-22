const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;
const fs = require('fs');
const mysql = require('mysql');
const convert = require('image-file-resize');
const connection = require('../lib/db');
const config = require('config');
const crypto = require('crypto');

// products
router.get('/products', function (request, response) {
    const keywords = (request.query.keywords ? request.query.keywords : "");
    const limit = (request.query.limit ? request.query.limit : 10);
    console.log(`INFO: Searching for keywords: "${keywords}" - limit to ${limit} products`);

    // specify connection directly to  SQL Injection
    const dbConfig = config.get('App.dbConfig');
    const mergedConfig = Object.assign({}, dbConfig, typeCastManager);
    // comment out line below and two above for default connection from db.js
    const connection = mysql.createConnection(mergedConfig);
    // Example SQL Injection
    let sql = connection.format(
        `SELECT BIN_TO_UUID(id) AS uuid, name, image, summary, price, rating, in_stock as inStock, on_sale as onSale, sale_price as salePrice FROM products WHERE name LIKE '%${keywords}%' LIMIT ${limit}`);
    connection.query(sql, function (error, results, fields) {
        if (error) {
            return response.sendStatus(500)
        } else {
            response.json(results)
        }
    });

});

// subscribe user to newsletter
router.post('/user/subscribe', function(request, response) {
    console.log("API :: subscriberUser");
    console.log(`adding email ${request.body.email}`);
    const file = "email-db.json";
    let user = {
        name: '',
        email: request.body.email
    }

    const appConf = config.get('App');
    const encryptionKey = appConf.encryptionKey;
    // uncomment for hard coded encryption key
    //const encryptionKey = "lakdsljkalkjlksdfkl";
    const algorithm = 'aes-256-ctr';
    const cipher = crypto.createCipher(algorithm, encryptionKey);

    try {

        // check if the file is writable.
        fs.access(file, fs.constants.W_OK, (err) => {
            if (!err) {
                // read file if it exists
                fs.readFile(file, (err, data) => {
                    // TODO: use cipher encryption
                    if (err) throw err;
                    let users = JSON.parse(data);
                    // add new user
                    users.push(user);
                    data = JSON.stringify(users);             
                    // write all users
                    fs.writeFile(file, data, (err) => {
                        if (err) throw err;
                        console.log('Email database updated.');
                    });
                });
            } else {
                let users = []; users.push(user);
                let data = JSON.stringify(users);
                // write new users
                fs.writeFile(file, data, (err) => {
                    if (err) throw err;
                    console.log('Email database created.');
                });
            }
        });

        return response.status(200).send({ success: true })
    } catch (error) {
        console.log(error);
        return response.status(500).send({ success: false, error: error })
    }
});

/*
// uncomment for command injection example
router.post('/site/backup', function(request, response) {
    child_process.exec(
        'gzip ' + request.query.file_path,
        function (error, data) {
            if (err) { return response.status(200).send({ success: false, error: error }) }
        }
    );
    return response.status(200).send({ success: true })
});
*/

router.post('/site/uploadImage', function(request, response) {
    fs.writeFileSync('/tmp/upload/${request.body.name}');

    // convert the image to correct size and format
    convert({ 
        file: '/tmp/upload/${request.body.name}',  
        width: 600, 
        height: 400, 
        type: 'jpeg'
    }).then(response => {
        exec('rm /tmp/upload/${request.body.name}');
        return response.sendStatus(200);
    }).catch(error => {
        return response.sendStatus(500);
    })

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
