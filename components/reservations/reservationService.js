const Reservation = require("../../models/reservations");

const query = (filter = {}) => Reservation.find(filter).lean();

const queryOne = (filter = {}) => Reservation.findOne(filter).lean();

const queryFor = (skip, limit, filter = {}) => Reservation.find(filter).skip(skip).limit(limit).lean();

const deleteOne = (filter = {}) => Reservation.deleteOne(filter);

const count = (filter = {}) => Reservation.countDocuments(filter);

module.exports = {
    query,
    queryOne,
    queryFor,
    deleteOne,
    count
}