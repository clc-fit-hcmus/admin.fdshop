const express = require('express');
const passport = require('passport');
const { isLoggedIn, notLoggedIn } = require('../utils/login');

const router = express.Router();

/* GET home page. */
router.get('/', notLoggedIn, function(req, res, next) {
  const errorMessages = req.flash('error');
  const successMessages = req.flash('success');
  res.render('index', { errorMessages: errorMessages, successMessages: successMessages, 
    hasErrors: errorMessages.length > 0, success: successMessages.length > 0 });
});

router.post('/', passport.authenticate('local.signin', {
  successRedirect: '/dashboard',
  failureRedirect: '/',
  failureFlash: true
}));

router.get('/dashboard', isLoggedIn, function(req, res, next) {
  res.render('dashboard/dashboard');
});

module.exports = router;
