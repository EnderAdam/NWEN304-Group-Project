const Product = require("../models/product");

/**
 * Render the index page for products
 * @param req - The request object
 * @param res - The response object
 */
const index = (req, res) => {
    Product.find().then(products => {
        res.render("products/index", {products: products});
    }).catch(err => {
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
    //TODO REQUIRE AUTHENTICATION
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

    // Save the product in the database and redirect to the product page
    product.save().then(() => {
        // Redirect to the new product page
        res.status(201).redirect(`/products/${product._id}`);
    }).catch(err => {
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
    Product.findById(id).then(product => {
        res.render("products/show", {product: product});
    }).catch(err => {
        res.status(404).render('404');
    });
}

/**
 * Render the Edit page for a product
 * @param req - The request object
 * @param res - The response object
 */
const edit = (req, res) => {
    //TODO REQUIRE AUTHENTICATION
    const {id} = req.params;
    Product.findById(id).then(product => {
        res.render("products/edit", {product: product});
    }).catch(err => {
        res.status(404).render('404');
    });
}

/**
 * Update a product from the form in /edit
 * @param req - The request object
 * @param res - The response object
 */
const update = (req, res) => {
    //TODO REQUIRE AUTHENTICATION
    const {name, price, description, imageUrl} = req.body;

    // This should be enforced by the HTML Form anyway
    if (!name || !price || !description || !imageUrl) {
        res.status(400);
        return;
    }

    const {id} = req.params;
    Product.findByIdAndUpdate(id, {name, price, description, imageUrl}, {new: true}).then(product => {
        res.status(200).redirect(`/products/${product._id}`);
    }).catch(err => {
        res.status(400).redirect("/products/edit");
    });
}

/**
 * Delete a product
 * @param req - The request object
 * @param res - The response object
 */
const destroy = (req, res) => {
    //TODO REQUIRE AUTHENTICATION
    const {id} = req.params;
    Product.findByIdAndDelete(id).then(() => {
        res.status(200).redirect("/products");
    }).catch(err => {
        res.status(404);
    });
}

module.exports = {
    index,
    newProduct,
    create,
    show,
    edit,
    update,
    destroy
}