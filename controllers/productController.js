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
    const {id} = req.params;
    Product.findByIdAndDelete(id).then(() => {
        res.status(200).redirect("/products");
    }).catch(err => {
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
    Product.findById(id).then(product => {
        if (!product) {
            res.status(404).redirect("/products");
        }
        // Get the user
        const user = req.user;
        user.purchases.push(product);
        user.save().then(() => {
            res.status(200).redirect("/account/purchases");
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