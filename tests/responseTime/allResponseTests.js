// Test API Response times for each of the five endpoints on the remote server and compare the results to the local server.

// Require all the individual Test files
const login = require('./POST Login.js');
const getAllProducts = require('./GET All Products.js');
const getProducts = require('./GET Product.js');
const postProduct = require('./POST Product.js');
const putProduct = require('./PUT Product.js');
const deleteProduct = require('./DELETE Product.js');

async function runTests() {
    // POST /login
    const token = await login();

    // GET /products
    console.log("GET api/products");
    await getAllProducts(token);

    // GET /products/:id
    console.log("GET api/products/:id");
    await getProducts();

    // POST /products/create
    console.log("POST api/products/create");
    let ids = await postProduct(token);

    // PUT /products/:id
    console.log("PUT api/products/:id");
    await putProduct(token, ids);

    // DELETE /products/:id
    console.log("DELETE api/products/:id");
    await deleteProduct(token, ids);
}

// Node.JS weirdness required to run an async function from the top level
(async () => {
    await runTests();
})();

