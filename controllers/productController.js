const Product = require("../models/product");
const fetch = require("node-fetch")
/**
 * Render the index page for products
 * @param req - The request object
 * @param res - The response object
 */
const index = async (req, res) => {
    let startTime = Date.now();

    let location = "Wellington"
    if(res.locals.auth && res.locals.user.region && res.locals.user.country){
        location = res.locals.user.region + ", " + res.locals.user.country
    }
    let response = await fetch("http://api.weatherstack.com/current?access_key="+process.env.WEATHERKEY+"&query="+location);
    let json = await response.json();


    Product.find().then(products => {
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Index Database took ${Date.now() - startTime}ms`);
        res.render("products/index", {products: products, temperature: json.current.temperature});
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Index Render took ${Date.now() - startTime}ms`);
    }).catch(() => {
        res.status(404).render('404');
    });
}

/**
 * Render the new product form
 * @param req - The request object
 * @param res - The response object
 */
const newProduct = (req, res) => {
    res.render("products/new");
}

/**
 * Create a new product from the form in /new
 * @param req - The request object
 * @param res - The response object
 */
const create = (req, res) => {
    const {name, price, description, imageUrl} = req.body;

    // This should be enforced by the HTML Form anyway
    if (!name || !price || !description || !imageUrl) {
        res.status(400).redirect("/products/new");
    }

    // Create a new product from the Product model
    const product = new Product({
        name,
        price,
        description,
        imageUrl
    });

    let startTime = Date.now();
    // Save the product in the database and redirect to the product page
    product.save().then(() => {
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Creation Database took ${Date.now() - startTime}ms`);
        // Redirect to the new product page
        res.status(201).redirect(`/products/${product._id}`);
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Creation Redirect took ${Date.now() - startTime}ms`);
    }).catch(() => {
        res.status(400).redirect("/products/new");
    });
}

/**
 * Render the Show page for a product
 * @param req - The request object
 * @param res - The response object
 */
const show = (req, res) => {
    const {id} = req.params;
    let startTime = Date.now();
    Product.findById(id).then(product => {
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Show Database took ${Date.now() - startTime}ms`);
        res.render("products/show", {product: product});
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Show Render took ${Date.now() - startTime}ms`);
    }).catch(() => {
        res.status(404).render('404');
    });
}

/**
 * Render the Edit page for a product
 * @param req - The request object
 * @param res - The response object
 */
const edit = (req, res) => {
    const {id} = req.params;
    let startTime = Date.now();
    Product.findById(id).then(product => {
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Edit Database took ${Date.now() - startTime}ms`);
        res.render("products/edit", {product: product});
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Edit Render took ${Date.now() - startTime}ms`);
    }).catch(() => {
        res.status(404).render('404');
    });
}

/**
 * Update a product from the form in /edit
 * @param req - The request object
 * @param res - The response object
 */
const update = (req, res) => {
    const {name, price, description, imageUrl} = req.body;

    // This should be enforced by the HTML Form anyway
    if (!name || !price || !description || !imageUrl) {
        res.status(400);
        return;
    }

    const {id} = req.params;

    let startTime = Date.now();
    Product.findByIdAndUpdate(id, {name, price, description, imageUrl}, {new: true}).then(product => {
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Update Database took ${Date.now() - startTime}ms`);
        res.status(200).redirect(`/products/${product._id}`);
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Update Redirect took ${Date.now() - startTime}ms`);
    }).catch(() => {
        res.status(400).redirect("/products/edit");
    });
}

/**
 * Delete a product
 * @param req - The request object
 * @param res - The response object
 */
const destroy = (req, res) => {
    const {id} = req.params;
    let startTime = Date.now();
    Product.findByIdAndDelete(id).then(() => {
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Deletion Database took ${Date.now() - startTime}ms`);
        res.status(200).redirect("/products");
        if (process.env.DEBUG) console.debug(`[DEBUG] Product Deletion Redirect took ${Date.now() - startTime}ms`);
    }).catch(() => {
        res.status(404);
    });
}

/**
 * Purchase a given product and redirect to previous purchases
 * @param req - The request object
 * @param res - The response object
 */
const purchase = (req, res) => {
    const {id} = req.params;
    let startTime = Date.now();
    Product.findById(id).then(product => {
        if (!product) {
            res.status(404).redirect("/products");
        }
        // Get the user
        const user = req.user;
        user.purchases.push(product);
        user.save().then(() => {
            if (process.env.DEBUG) console.debug(`[DEBUG] Product Purchase Database took ${Date.now() - startTime}ms`);
            res.status(200).redirect("/account/purchases");
            if (process.env.DEBUG) console.debug(`[DEBUG] Product Purchase Redirect took ${Date.now() - startTime}ms`);
        }).catch(() => {
            res.status(400).redirect("/products");
        });
    }).catch(() => {
        res.status(404).redirect("/products");
    });
}

module.exports = {
    index,
    newProduct,
    create,
    show,
    edit,
    update,
    destroy,
    purchase
}