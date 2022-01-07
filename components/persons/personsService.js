const Person = require("../../models/persons");
const passport = require('passport');
const ObjectId = require('mongodb').ObjectId;

const query = (filter = {}) => Person.find(filter).lean();

const queryOne = (filter = {}) => Person.findOne(filter).lean();

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => Person.findById(id, (err, user) => done(err, user)));

const update = (req) => {
    Person.findOne( { $and: [
        { '_id': { $ne: req.user._id } }, 
        { 'info.ssn': req.body.ssn }, 
        {'login.role': 'admin'} ] }, (error, result) => {
        var errors = req.validationErrors();
        if (errors) {
            req.flash('error', 'Something went wrong! Please try again!');
            return;
        }

        if (result) {
            console.log(result);
            req.flash('error', 'SSN has been already existed! Please try again!')
            return;
        }

        if (!/^\d+$/.test(req.body.phone_number)) {
            req.flash('error', 'Your phone must contains only digits! Please try again!')
            return;
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
                    console.log(user);
                    req.flash('success', 'Your profile has been already updated!')
                } else {
                    console.log(err);
                    req.flash('error', 'Something went wrong! Please try again!')
                }
            });
    })
};

module.exports = {
    query,
    queryOne,
    update
}