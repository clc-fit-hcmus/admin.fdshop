const express = require('express');
const csrf = require('csurf');
const passport = require('passport');
const { isLoggedIn, notLoggedIn } = require('../../utils/login')
const { getPersons } = require('./personsController');

const router = express.Router();

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/list', isLoggedIn, getPersons);

router.get('/profile', isLoggedIn, function(req, res, next) {
  const user = req.user.toJSON();
  console.log(req.user)
  res.render('staffs/profile', { user });
});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
})

router.get('/register', isLoggedIn, function(req, res, next) {
  res.render('staffs/register');
});

router.get('/up', isLoggedIn, function(req, res, next) {
  const messages = req.flash('error');
  res.render('staffs/signUp', { csrfToken: req.csrfToken(), body: req.query, messages: messages, hasErrors: messages.length > 0 });
});

router.post('/up', passport.authenticate('local.signup', {
  successRedirect: '/dashboard',
  failureRedirect: '/up',
  failureFlash: true
}));

module.exports = router;
