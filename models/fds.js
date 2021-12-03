const mongoose = require("mongoose");

const FD = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    release_date: {
        type: Date,
        default: Date.now
    },

    is_best: {
        type: Boolean,
        require: true,
        default: false
    },

    is_drink: {
        type: Boolean,
        require: true,
        default: false
    },

    price: {
        type: Number,
        required: true
    },

    discount: {
        type: Number,
        required: true,
        default: 0
    },

    description: {
        type: String,
        required: true,
        default: null
    },

    avatar: {
        type: String,
        required: true
    },

    cloudinary_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("FoodsAndDrinks", FD, "foodsanddrinks");