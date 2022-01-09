const express = require('express');
const passport = require('passport');
const { isLoggedIn } = require('../../utils/login')
const { getPersons } = require('./personsController');

const router = express.Router();

router.get('/list-user', isLoggedIn, getPersons);

router.get('/profile', isLoggedIn, function(req, res, next) {
  const user = req.user.toJSON();
  const errorMessages = req.flash('error');
  const successMessages = req.flash('success');
  res.render('persons/profile', { user, errorMessages: errorMessages, successMessages: successMessages, 
    hasErrors: errorMessages.length > 0, success: successMessages.length > 0 });
});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
})

router.get('/register', isLoggedIn, function(req, res, next) {
  const errorMessages = req.flash('error');
  const successMessages = req.flash('success');
  res.render('persons/register', { errorMessages: errorMessages, hasErrors: errorMessages.length > 0,
    successMessages: successMessages, success: successMessages.length > 0 });
});

router.post('/register', passport.authenticate('local.signup', {
  successRedirect: '/register',
  failureRedirect: '/register',
  failureFlash: true
}));

router.post('/profile', passport.authenticate('local.update', {
  successRedirect: '/profile',
  failureRedirect: '/profile',
  failureFlash: true
}));

router.post('/list-user', passport.authenticate('local.block', {
  successRedirect: '/list-user',
  failureRedirect: '/list-user',
  failureFlash: true
}));

module.exports = router;
