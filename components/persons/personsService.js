const Person = require("../../models/persons");
const passport = require('passport');
const ObjectId = require('mongodb').ObjectId;

const query = (filter = {}) => Person.find(filter).lean();

const queryOne = (filter = {}) => Person.findOne(filter).lean();

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => Person.findById(id, (err, user) => done(err, user)));

module.exports = {
    query,
    queryOne
}