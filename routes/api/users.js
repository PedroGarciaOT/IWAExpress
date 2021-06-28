const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = require('../../lib/db');
const config = require('config');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage users.
 *
 */

/**
 * @swagger
 *   components:
 *     schemas:
 *      User:
 *        type: object
 *        required:
 *          - id
 *          - username
 *          - password
 *          - email
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated internal id of the user.
 *          username:
 *            type: string
 *            description: The users unique username.
 *          password:
 *            type: string
 *            description: The users encrypted password.
 *          email:
 *            type: string
 *            description: The users unique email.
 *        example:
 *            username: user1
 *            email: user1@localhost.com
 */

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get all of the users filtered by keywords.
 *     tags: [Users]
 *     parameters:
 *       - name: keywords
 *         description: Keywords to search for in the users name/email.
 *         type: string
 *         in: query
 *       - name: limit
 *         description: Maximum (limit) of results to return.
 *         type: integer
 *         in: query
 *     responses:
 *       200:
 *         description: The list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 */
router.get('/', function (request, response) {
    const keywords = (request.query.keywords ? request.query.keywords : "");
    const limit = (request.query.limit ? request.query.limit : 10);
    console.log(`INFO: Searching for keywords: "${keywords}" - limit to ${limit} users`);
    return response.sendStatus(201);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     description: Get a single user by their id.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true  
 *         description: The users's UUID.
 *     responses:
 *       200:
 *         description: The user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *
 */
router.get('/:id', function (request, response) {
    const userId = request.params.id;
    console.log(`INFO: Retrieving user with id: ${userId}`);
});

/**
 * @swagger
 * /users:
 *   post:
 *     description: Create a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal error.
 *
 */
router.post('/', function (request, response) {
    const user = request.body
    console.log(`INFO: Creating user with data: ${user}`);
    return response.sendStatus(201);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     description: Update an existing user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's UUID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal error.
 *
 */
router.put('/:id', function (request, response) {
    const userId = request.params.id;
    const user = request.body
    console.log(`INFO: Updating user with id: ${userId} and data: ${user}`);
    return response.sendStatus(201);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     description: Delete a single user by its id.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's UUID.
 *     responses:
 *       200:
 *         description: User deleted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *
 */
router.delete('/:id', function (request, response) {
    const userId = request.params.id;
    console.log(`INFO: Deleting user with id: ${userId}`);
    return response.sendStatus(201);
});

module.exports = router;
