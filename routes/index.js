const express = require('express');
const passport = require('passport');
const { isLoggedIn, notLoggedIn } = require('../utils/login');

const router = express.Router();

/* GET home page. */
router.get('/', notLoggedIn, function(req, res, next) {
  const messages = req.flash('error');
  res.render('index', { messages: messages, hasErrors: messages.length > 0 });
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
