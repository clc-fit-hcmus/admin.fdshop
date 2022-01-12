const express = require('express');
const passport = require('passport');
const { isLoggedIn, notLoggedIn } = require('../../utils/login')
const { getPersons, 
  blockUser, 
  getPerson, 
  blockUserInProfile, 
  resetRequest, 
  resetPassword, 
  getResetRequest,
  changePassword } = require('./personsController');

const router = express.Router();

router.get('/list-user', isLoggedIn, getPersons);

router.get('/profile', isLoggedIn, function(req, res, next) {
  const user = req.user.toJSON();
  const errorMessages = req.flash('error');
  const successMessages = req.flash('success');
  res.render('persons/profile', { user, errorMessages: errorMessages, successMessages: successMessages, 
    hasErrors: errorMessages.length > 0, success: successMessages.length > 0 });
});

router.get('/forgot-password', notLoggedIn, function(req, res, next) {
  const errorMessages = req.flash('error');
  const successMessages = req.flash('success');
  res.render('persons/forgot-password', { errorMessages: errorMessages, successMessages: successMessages, 
    hasErrors: errorMessages.length > 0, success: successMessages.length > 0 });
});

router.get('/password-reset/:userId/:token', notLoggedIn, getResetRequest);

router.get('/user-profile/:id', isLoggedIn, getPerson);

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

router.get('/confirm-change-password/:userId/:token', function(req, res, next) {
  res.render('persons/confirm-change-password', { password: req.query.password, id: req.params.userId, token: req.params.token });
});
router.get('/password-change/:userId/:token', function(req, res, next) {
  req.logout();
  res.redirect(`/confirm-change-password/${req.params.userId}/${req.params.token}?password=${req.query.password}`);
});

router.post('/list-user', blockUser);
router.post('/user-profile', blockUserInProfile);
router.post('/forgot-password', resetPassword);
router.post('/change-password', changePassword);
router.post('/password-reset/:userId/:token', resetRequest);
router.post('/password-change/:userId/:token', passport.authenticate('local.changePassword', {
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true
}));

module.exports = router;
