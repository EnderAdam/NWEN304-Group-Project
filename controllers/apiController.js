const Product = require("../models/product");
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

module.exports = {
    show,
    create,
    update,
    destroy
}