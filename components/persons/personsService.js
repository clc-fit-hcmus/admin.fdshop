const Person = require("../../models/persons");

const query = (filter = {}) => Person.find(filter).lean();

const queryOne = (filter = {}) => Person.findOne(filter).lean();

const queryFor = (skip, limit, filter = {}) => Person.find(filter).skip(skip).limit(limit).lean();

const count = (filter = {}) => Person.countDocuments(filter);

module.exports = {
    query,
    queryOne,
    queryFor,
    count
}