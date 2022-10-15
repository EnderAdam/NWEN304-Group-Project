const Product = require("../models/product");
const passport = require("passport");
const jwt = require('jsonwebtoken');


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

const destroy = (req, res) => {
    const {id} = req.params;
    //TODO DOESNT CHECK IF PRODUCT EXISTS FIRST
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

const login = (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
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
            const token = jwt.sign({user: body}, 'secret'); //TODO Change

            return res.json({token});
        });
    })(req, res, next);
}

module.exports = {
    show,
    create,
    update,
    destroy,
    login
}