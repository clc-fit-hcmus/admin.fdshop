const Person = require("../../models/persons");

const query = (filter = {}) => Person.find(filter).lean();

const queryOne = (filter = {}) => Person.findOne(filter).lean();

module.exports = {
    query,
    queryOne
}