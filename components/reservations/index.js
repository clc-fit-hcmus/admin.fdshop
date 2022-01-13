const express = require('express');
const { isLoggedIn } = require('../../utils/login')
const { getReservations } = require('./reservationController')

const router = express.Router();

router.get('/reservation-list', isLoggedIn, getReservations);

module.exports = router;