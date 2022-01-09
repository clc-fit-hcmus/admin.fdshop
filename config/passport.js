const passport = require('passport');
const Person = require('../models/persons');
const localStrategy = require('passport-local').Strategy;
const { getAccount } = require('../utils/utils');
const moment = require('moment');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => Person.findById(id, (err, user) => done(err, user)));

passport.use('local.signup', new localStrategy({
    usernameField: 'name',
    passwordField: 'name',
    passReqToCallback: true
}, (req, username, password, done) => {
    Person.findOne( { $and: [ 
        { 'info.ssn': req.body.ssn }, 
        {'login.role': req.body.role} ] }, async (error, result) => {
            if (error) {
                return done(err, req.flash('error', 'Something went wrong! Please try again!'));
            }

            if (result) {
                return done(null, false, req.flash('error', 'User has already existed! Please try again!'));
            }

            var person = new Person();

            person.login.username = await getAccount(username);
            person.login.password = person.encryptPassword(moment(req.body.date_of_birth).format("DDMMYYYY"));
            person.login.role = req.body.role;

            person.info.name = req.body.name;
            person.info.date_of_birth = Date.parse(req.body.date_of_birth);
            person.info.sex = req.body.sex;
            person.info.ssn = req.body.ssn;
            person.info.citizenship = req.body.citizenship;
            person.info.email = req.body.email;
            person.info.phone_number = req.body.phone_number;
            person.info.address = req.body.address;

            person.save((err, result) => {
                if(err) {
                    return done(err, req.flash('error', 'Something went wrong! Please try again!'));
                }
                return done(null, req.user, req.flash('success', `User was created with ${person.login.username}`));
            });
    });
}));

passport.use('local.signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    Person.findOne({ 'login.username': username, 'login.role': 'admin' }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, req.flash('error', 'No user found!'));
        }
        if (!user.validPassword(password, user.login.password)) {
            return done(null, false, req.flash('error', 'Wrong password!'));
        }
        if (!user.is_active) {
            return done(null, false, req.flash('error', 'Your account has been locked!'));
        }

        return done(null, user);
    })
}));

passport.use('local.update', new localStrategy({
    usernameField: 'name',
    passwordField: 'name',
    passReqToCallback: true
}, (req, username, password, done) => {
    Person.findOne( { $and: [
        { '_id': { $ne: req.user._id } }, 
        { 'info.ssn': req.body.ssn }, 
        {'login.role': 'admin'} ] }, (error, result) => {
        if (result) {
            return done(null, false, req.flash('error', 'SSN has already existed! Please try again!'));
        }

        if (!/^\d+$/.test(req.body.phone_number)) {
            return done(null, false, req.flash('error', 'Your phone must contains only digits! Please try again!'));
        }

        req.session.passport.user = req.user;

        req.session.passport.user.info.ssn = req.body.ssn;
        req.session.passport.user.info.citizenship = req.body.citizenship;
        req.session.passport.user.info.address = req.body.address;
        req.session.passport.user.info.name = req.body.name;
        req.session.passport.user.info.date_of_birth = req.body.date_of_birth;
        req.session.passport.user.info.sex = req.body.sex;
        req.session.passport.user.info.phone_number = req.body.phone_number;

        Person.findByIdAndUpdate(req.user.id, req.session.passport.user,
            (err, user) => {

                if(!err){
                    return done(null, user, req.flash('success', 'Your profile has been already updated!'));
                } else {
                    return done(null, false, req.flash('error', 'Something went wrong! Please try again!'));
                }
            });
    })
}));

passport.use('local.block', new localStrategy({
    usernameField: 'id',
    passwordField: 'is_active',
    passReqToCallback: true
}, (req, username, password, done) => {
    const status = password == "true" ? false : true;
    Person.findByIdAndUpdate(username, { is_active: status }, (error, result) => {
        if (!result || error) {
            return done(null, false, req.flash('error', 'Something went wrong! Please try again!'));
        }

        if (result.is_active) {
            return done(null, false, req.flash('error', `${result.info.name} has been locked!`));
        }

        return done(null, false, req.flash('success', `${result.info.name} has been activated!`));
    })
}));