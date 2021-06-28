const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;
const fs = require('fs');
const mysql = require('mysql');
const convert = require('image-file-resize');
const connection = require('../../lib/db');
const config = require('config');
const crypto = require('crypto');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

/**
 * @swagger
 * tags:
 *   name: Site
 *   description: API to manage site.
 *
 */

// subscribe user to newsletter
router.post('/subscribe-newsletter', function (request, response) {
    console.log("API :: Site Subscribe Newsletter");
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
router.post('/backup', function(request, response) {
    child_process.exec(
        'gzip ' + request.query.file_path,
        function (error, data) {
            if (err) { return response.status(200).send({ success: false, error: error }) }
        }
    );
    return response.status(200).send({ success: true })
});
*/

router.post('/upload-image', function(request, response) {
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

module.exports = router;
