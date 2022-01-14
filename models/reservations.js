const mongoose = require("mongoose");

const Reservation = new mongoose.Schema({
    phone_number: {
        type: String,
        required: true
    },

    people: {
        type: Number,
        required: true,
        default: 1
    },

    when: {
        type: Date,
        required: true
    },

    accept: {
        type: Number,
        default: 0
    },

    table: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model("reservations", Reservation);