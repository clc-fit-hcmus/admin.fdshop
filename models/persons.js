const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');
const passport = require("passport");

const Person = new mongoose.Schema({
    login: {
        username: {
            type: String,
            required: true
        },
    
        password: {
            type: String,
            required: true
        },
    
        role: {
            type: String,
            required: true
        }
    },

    info: {
        name: {
            type: String,
            required: true
        },
    
        date_of_birth: {
            type: Date,
            required: true
        },
    
        sex: {
            type: String,
            require: true
        },
    
        ssn: {
            type: String,
            default: null
        },
    
        citizenship: {
            type: String,
            default: null
        },
    
        email: {
            type: String,
            default: null
        },
    
        phone_number: {
            type: String,
            required: true
        },
    
        address: {
            type: String,
            default: null
        }
    }
});

Person.methods.encryptPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);

Person.methods.validPassword = (password, userPW) => bcrypt.compareSync(password, userPW);

module.exports = mongoose.model("persons", Person);