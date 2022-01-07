const express = require('express');
const passport = require('passport');
const { isLoggedIn, notLoggedIn } = require('../../utils/login')
const { getPersons, updateProfile } = require('./personsController');

const router = express.Router();

router.get('/list', isLoggedIn, getPersons);

router.get('/profile', isLoggedIn, function(req, res, next) {
  const user = req.user.toJSON();
  const errorMessages = req.flash('error');
  const successMessages = req.flash('success');
  res.render('staffs/profile', { user, errorMessages: errorMessages, successMessages: successMessages, 
    hasErrors: errorMessages.length > 0, success: successMessages.length > 0 });
});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
})

router.get('/register', isLoggedIn, function(req, res, next) {
  const errorMessages = req.flash('error');
  const successMessages = req.flash('success');
  res.render('staffs/register', { errorMessages: errorMessages, hasErrors: errorMessages.length > 0,
    successMessages: successMessages, success: successMessages.length > 0 });
});

router.post('/register', passport.authenticate('local.signup', {
  successRedirect: '/register',
  failureRedirect: '/register',
  failureFlash: true
}));

router.get('/up', isLoggedIn, function(req, res, next) {
  const messages = req.flash('error');
  res.render('staffs/signUp', { body: req.query, messages: messages, hasErrors: messages.length > 0 });
});

router.post('/profile', passport.authenticate('local.update', {
  successRedirect: '/profile',
  failureRedirect: '/profile',
  failureFlash: true
}));

module.exports = router;
