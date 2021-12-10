const express = require('express');
const csrf = require('csurf');
const passport = require('passport');
const { isLoggedIn, notLoggedIn } = require('../utils/login');

const router = express.Router();

const csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', notLoggedIn, function(req, res, next) {
  const messages = req.flash('error');
  res.render('index', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
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
