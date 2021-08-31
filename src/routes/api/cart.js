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
 *   name: Cart
 *   description: API to manage shopping cart.
 *
 */


module.exports = router;
