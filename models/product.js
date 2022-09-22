const {Schema, model} = require("mongoose");

const productSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String
});

module.exports = model("Product", productSchema);