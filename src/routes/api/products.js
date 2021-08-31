const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = require('../../lib/db');
const config = require('config');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API to manage products.
 *
 */

/**
 * @swagger
 *   components:
 *     schemas:
 *      Product:
 *        type: object
 *        required:
 *          - id
 *          - code
 *          - name
 *          - summary
 *          - description
 *          - price
 *        properties:
 *          id:
 *            type: string
 *            description: The products unique id (as a UUID).
 *          code:
 *            type: string
 *            description: The product's user referenceable code.
 *          name:
 *            type: string
 *            description: The name of the product.
 *          summary:
 *            type: string
 *            description: A brief summary of the product.
 *          description:
 *            type: string
 *            description: A detailed description of the product.
 *          image:
 *            type: string
 *            description: The filename of the product image to show.
 *          price:
 *            type: number
 *            description: The price of the product.
 *          on_sale:
 *            type: boolean
 *            description: Whether the product is on sale?
 *          sale_price:
 *            type: number
 *            description: The sale price of the product.
 *          in_stock:
 *            type: boolean
 *            description: Whether the product is in stock?
 *          time_to_stock:
 *            type: integer
 *            description: The number of days before the product will be in stock.
 *          rating:
 *            type: integer
 *            minimum: 0
 *            maximum: 5
 *            description: The average customer rating of the product.
 *          available:
 *            type: boolean
 *            description: Whether the product is available/visible?
 *        example:
 *            code: SWA234-A568-00010
 *            name: Solodox 750
 *            rating: 4
 *            summary: Lorem ipsum dolor sit amet.
 *            description: Maecenas sit amet quam eget neque vestibulum tincidunt vitae vitae augue.
 *            image: generic-product-1.jpg
 *            price: 14.95
 *            in_stock: true
 *            time_to_stock: 30
 *            available: true
 */

/**
 * @swagger
 * /products:
 *   get:
 *     description: Get all of the products filtered by keywords.
 *     tags: [Products]
 *     parameters:
 *       - name: keywords
 *         description: Keywords to search for in the products name/description.
 *         type: string
 *         in: query
 *       - name: limit
 *         description: Maximum (limit) of results to return.
 *         type: integer
 *         in: query
 *     responses:
 *       200:
 *         description: The list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 */
router.get('/', function (request, response) {
    const keywords = (request.query.keywords ? request.query.keywords : "");
    const limit = (request.query.limit ? request.query.limit : 10);
    console.log(`INFO: Searching for keywords: "${keywords}" - limit to ${limit} products`);

    // configure connection directly to allow SQL Injection to be discovered!
    const dbConfig = config.get('App.dbConfig');
    const mergedConfig = Object.assign({}, dbConfig, typeCastManager);
    const connection = mysql.createConnection(mergedConfig);

    // Example SQL Injection
    let sql = connection.format(
        `SELECT BIN_TO_UUID(id) AS id, name, image, summary, price, rating, in_stock as inStock, on_sale as onSale, sale_price as salePrice FROM products WHERE name LIKE '%${keywords}%' LIMIT ${limit}`);
    connection.query(sql, function (error, results, fields) {
        if (error) {
            return response.sendStatus(500)
        } else {
            response.json(results)
        }
    });

});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     description: Get a single product by its id.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true  
 *         description: The product's UUID.
 *     responses:
 *       200:
 *         description: The product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found.
 *
 */
router.get('/:id', function (request, response) {
    const productId = request.params.id;
    console.log(`INFO: Retrieving product with id: ${productId}`);

    let sql = connection.format(
        `SELECT BIN_TO_UUID(id) AS id, name, image, summary, price, rating, in_stock as inStock, on_sale as onSale, sale_price as salePrice FROM products WHERE id = UUID_TO_BIN('${productId}')`);
    connection.query(sql, function (error, results, fields) {
        if (error) {
            return response.sendStatus(500)
        } else {
            if (results.length > 0) {
                response.json(results[0])
            } else {
                return response.sendStatus(404)
            }
        }
    });
    
});

/**
 * @swagger
 * /products:
 *   post:
 *     description: Create a new product.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The created product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal error.
 *
 */
router.post('/', function (request, response) {
    const product = request.body
    console.log(`INFO: Creating product with data: ${product}`);
    return response.sendStatus(201);
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     description: Update an existing product.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product's UUID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The updated product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal error.
 *
 */
router.put('/:id', function (request, response) {
    const productId = request.params.id;
    const product = request.body
    console.log(`INFO: Updating product with id: ${productId} and data: ${product}`);
    return response.sendStatus(201);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     description: Delete a single product by its id.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product's UUID.
 *     responses:
 *       200:
 *         description: Product deleted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 *
 */
router.delete('/:id', function (request, response) {
    const productId = request.params.id;
    console.log(`INFO: Deleting product with id: ${productId}`);
    return response.sendStatus(201);
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
