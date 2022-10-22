const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Product = require('./product');

const User = new Schema({ // Create a new schema for the user
    username: String,
    password: String,
    googleId: String,
    purchases: [Product.schema],
    isAdmin: boolean = false,
    country: String,
    region: String,
});

// Setting up the passport plugin
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);