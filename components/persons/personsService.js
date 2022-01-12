const Person = require("../../models/persons");
const bcrypt = require('bcrypt-nodejs');

const query = (filter = {}) => Person.find(filter).lean();

const queryById = (id) => Person.findById(id).lean();

const queryOne = (filter = {}) => Person.findOne(filter).lean();

const queryFor = (skip, limit, filter = {}) => Person.find(filter).skip(skip).limit(limit).lean();

const count = (filter = {}) => Person.countDocuments(filter);

const findByIdAndUpdate = (id, filter = {}) => Person.findByIdAndUpdate(id, filter).lean();

const encryptPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);

const validPassword = (password, userPW) => bcrypt.compareSync(password, userPW);

module.exports = {
    query,
    queryById,
    queryOne,
    queryFor,
    count,
    findByIdAndUpdate,
    encryptPassword,
    validPassword
}