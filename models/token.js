const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: String,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expires: {
        type: Number,
        default: 3600000, //1 hour in milliseconds
    }
});

module.exports = mongoose.model("token", tokenSchema);
