const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = require('../../lib/db');
const config = require('config');

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: API to manage payment cards.
 *
 */

/**
 * @swagger
 *   components:
 *     schemas:
 *      Card:
 *        type: object
 *        required:
 *          - id
 *          - issuer
 *          - number
 *          - name
 *          - expiryMonth
 *          - expiryYear
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated internal id of the payment card.
 *          issuer:
 *            type: string
 *            description: The issuer of the payment card.
 *          number:
 *            type: string
 *            description: The unique payment card number.
 *          name:
 *            type: string
 *            description: the name of the user the payment card belongs to.
 *          address:
 *            type: string
 *            description: The address of the user owning the payment card.
 *          country:
 *            type: string
 *            description: The country of the user owning the payment card.
 *          expiryMonth:
 *            type: integer
 *            description: The number of the month the payment card expires on.
 *          expiryYear:
 *            type: integer
 *            description: The year the payment card expires on. 
 *          preferred:
 *            type: boolean
 *            description: Whether this payment card is the users preferred card.
 *          account:
 *            type: integer
 *            description: the id of the account the payment card belongs to.
 *        example:
 *            id: f8106a24-e3da-4756-9bc5-ab327d8b04a6
 *            issuer: American Express
 *            number: 346318648160512
 *            name: Amber Thompson
 *            address: Country Club Road 84
 *            country: Austria
 *            expiryMonth: 11
 *            expiryYear: 2021
 *            preferred: 1
 *            account: b376cec4-7982-4421-9782-7b06baa98a03
 *            
 *            
 */

/**
 * @swagger
 * /cards:
 *   get:
 *     description: Get all of the cards filtered by account.
 *     tags: [Cards]
 *     parameters:
 *       - name: account
 *         description: UUID of the account the card belongs to.
 *         type: string
 *         in: query
 *       - name: limit
 *         description: Maximum (limit) of results to return.
 *         type: integer
 *         in: query
 *     responses:
 *       200:
 *         description: The list of cards.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *
 */
router.get('/', function (request, response) {
    const account = (request.query.account ? request.query.account : "");
    const limit = (request.query.limit ? request.query.limit : 10);
    console.log(`INFO: Searching cards of account: "${account}" - limit to ${limit} cards`);

    let sql = connection.format(`SELECT BIN_TO_UUID(id) AS id, issuer, number, name, address, country, expiry_month as expiryMonth, expiry_year as expiryYear, preferred FROM cards LIMIT ${limit}`);
    if (account) {
        sql = connection.format(`SELECT BIN_TO_UUID(id) AS id, issuer, number, name, address, country, expiry_month as expiryMonth, expiry_year as expiryYear, preferred FROM cards WHERE account = UUID_TO_BIN('${account}') LIMIT ${limit}`);
    }    
    connection.query(sql, function (error, results, fields) {
        if (error) {
            return response.sendStatus(500)
        } else {
            if (results.length > 0) { 
                response.json(results)
            } else {
                return response.sendStatus(404)
            }
        }
    });

});

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     description: Get a single card by its UUID.
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true  
 *         description: The cards's UUID.
 *     responses:
 *       200:
 *         description: The card.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Card not found.
 *
 */
router.get('/:number', function (request, response) {
    const cardId = request.params.id;
    console.log(`INFO: Retrieving card with id: ${cardId}`);
});

/**
 * @swagger
 * /cards:
 *   post:
 *     description: Create a new card.
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       201:
 *         description: The created card.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal error.
 *
 */
router.post('/', function (request, response) {
    const card = request.body
    console.log(`INFO: Creating card with data: ${card}`);
    return response.sendStatus(201);
});

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     description: Update an existing card.
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cards's UUID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Card'
 *     responses:
 *       200:
 *         description: The updated card.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal error.
 *
 */
router.put('/:id', function (request, response) {
    const cardId = request.params.id;
    const card = request.body
    console.log(`INFO: Updating card with id: ${cardId} and data: ${card}`);
    return response.sendStatus(201);
});

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     description: Delete a single card by its id.
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cards's UUID.
 *     responses:
 *       200:
 *         description: Card deleted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Card not found.
 *
 */
router.delete('/:id', function (request, response) {
    const cardId = request.params.id;
    console.log(`INFO: Deleting card with id: ${cardId}`);
    return response.sendStatus(201);
});

module.exports = router;
