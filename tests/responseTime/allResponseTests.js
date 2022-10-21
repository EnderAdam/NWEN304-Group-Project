// Test API Response times for each of the five endpoints on the remote server and compare the results to the local server.

// Start up the server with the test database and run the tests
process.env.NODE_ENV = 'test';
const server = require('../../app.js');

// Require all the individual Test files
const login = require('./POST Login.js');
const [getAllProducts, getAllProductsLoad] = require('./GET All Products.js');
const [getProducts, getProductsLoad] = require('./GET Product.js');
const [postProduct, postProductLoad] = require('./POST Product.js');
const [putProduct, putProductLoad] = require('./PUT Product.js');
const [deleteProduct, deleteProductLoad]  = require('./DELETE Product.js');

async function runTests() {
    // POST /login
    const token = await login();

    // GET /products
    console.log("GET api/products");
    await getAllProducts();
    await getAllProductsLoad();

    // GET /products/:id
    console.log("GET api/products/:id");
    await getProducts();
    await getProductsLoad();

    // POST /products/create
    console.log("POST api/products/create");
    let ids = await postProduct(token);
    let idsLoad = await postProductLoad(token);

    // PUT /products/:id
    console.log("PUT api/products/:id");
    await putProduct(token, ids[0], ids[1]);
    await putProductLoad(token, idsLoad[0], idsLoad[1]);

    // DELETE /products/:id
    console.log("DELETE api/products/:id");
    await deleteProduct(token, ids[0], ids[1]);
    await deleteProductLoad(token, idsLoad[0], idsLoad[1]);

    // Close the server and exit the process
    server.close();
    process.exit();
}

// Node.JS weirdness required to run an async function from the top level
(async () => {
    await runTests();
})();

