const Product = require("../models/product");
const passport = require("passport");
const jwt = require('jsonwebtoken');

/**
 * Create a new product in the database based on the provided data
 * @param req - The request object
 * @param res - The response object
 */
const create = (req, res) => {
    const {name, price, description, imageUrl} = req.body;

    if (!name || !price || !description || !imageUrl) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Create a new product from the Product model
    const product = new Product({
        name,
        price,
        description,
        imageUrl
    });

    // Save the product in the database and return the response
    product.save().then(() => {
        res.status(201).json({
            message: "Product created successfully",
            product
        });
    }).catch(err => {
        res.status(500).json({
            message: "Product creation failed",
            err
        });
    });
}

/**
 * Return all products in JSON form
 * @param req - The request object
 * @param res - The response object
 */
const index = (req, res) => {
    Product.find().then(products => {
        res.status(200).json({
            products
        });
    }).catch(err => {
        res.status(500).json({
            message: "Products not found",
            err
        });
    });
}

/**
 * Return a given product in JSON form based on the provided id
 * @param req - The request object
 * @param res - The response object
 */
const show = (req, res) => {
    const {id} = req.params;
    Product.findById(id).then(product => {
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product found",
            product
        });
    }).catch(err => {
        res.status(404).json({
            message: "Product not found",
            err
        });
    });
}

/**
 * Update a product in the database
 * @param req - The request object
 * @param res - The response object
 */
const update = (req, res) => {
    const {name, price, description, imageUrl} = req.body;

    if (!name || !price || !description || !imageUrl) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const {id} = req.params;
    Product.findByIdAndUpdate(id, {name, price, description, imageUrl}, {new: true}).then(product => {
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product updated successfully",
            product
        });
    }).catch(err => {
        res.status(500).json({
            message: "Product update failed",
            err
        });
    });
}

/**
 * Destroy a given product from the database
 * @param req - The request object
 * @param res - The response object
 */
const destroy = (req, res) => {
    const {id} = req.params;
    Product.findByIdAndDelete(id).then(() => {
        res.status(200).json({
            message: "Product deleted successfully"
        });
    }).catch(err => {
        res.status(500).json({
            message: "Product deletion failed",
            err
        });
    });
}

/**
 * Attempt to log in a user with their username and password, returning a valid JWT token if the login is successful
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function to call
 */
const login = (req, res, next) => {
    passport.authenticate('local', function (err, user) {
        if (err || !user) {
            return res.status(401).json({
                message: "Login failed",
            });
        }
        req.logIn(user, {session: false}, function (err) {
            if (err) {
                return res.status(401).json({
                    message: "Login failed",
                });
            }
            const body = {_id: user._id, email: user.email};
            const token = jwt.sign({user: body}, 'secret');

            return res.json({token});
        });
    })(req, res, next);
}

/**
 * Authenticate the JWT token sent in the authorization field of a given request to ensure that the user is logged in
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function to call
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'secret', (err) => {
        if (err) return res.sendStatus(403);
        next();
    });
}

module.exports = {
    index,
    show,
    create,
    update,
    destroy,
    login,
    authenticateToken
}