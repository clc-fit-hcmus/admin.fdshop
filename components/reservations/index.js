const express = require('express');
const { isLoggedIn } = require('../../utils/login')

const router = express.Router();

router.get('/reservation-list', isLoggedIn, function(req, res, next) {
  res.render('reservations/reservation-list');
});

module.exports = router;