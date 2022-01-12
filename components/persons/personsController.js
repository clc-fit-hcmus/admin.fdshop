const { queryFor, count, findByIdAndUpdate, queryById, queryOne, encryptPassword, validPassword } = require("./personsService");
const Joi = require("joi");
const Token = require("../../models/PasswordReset");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");

// get Persons from DB
const getPersons = async (req, res) => {
    try {
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');

        const role = req.query.role;

        let filter = {}
        let currentRole = "";
        if (role == "admin") {
            filter = { "login.role": "admin" };
            currentRole = "&role=admin";
        } else if (role == "staff") {
            filter = { "login.role": "staff" };
            currentRole = "&role=staff";
        } else if (role == "customer") {
            filter = { "login.role": "customer" };
            currentRole = "&role=customer";
        }

        const perPage = 10;
        const maxPage = Math.ceil((await count(filter)) / perPage);
        const page = ((t = (req.query.page || 1)) <= maxPage) && (t > 0) ? t : 1;
        
        const persons = await queryFor((perPage * page) - perPage, perPage, filter);

        res.render('persons/list', {
            persons,
            current: page,
            is_overload: page >= maxPage,
            is_notOne: maxPage > 1,
            pages: maxPage,
            next: parseInt(page) + 1,
            prev: (c = parseInt(page) - 1) ? c : 0,
            currentRole: currentRole,
            errorMessages: errorMessages, 
            hasErrors: errorMessages.length > 0,
            successMessages: successMessages, 
            success: successMessages.length > 0
          });
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
}

const getPerson = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await queryById(id);
        const errorMessages = req.flash('error');
        const successMessages = req.flash('success');
        res.render('persons/user-profile', { user, errorMessages: errorMessages, successMessages: successMessages, 
            hasErrors: errorMessages.length > 0, success: successMessages.length > 0 });
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
}

const blockUser = async (req, res) => {
    try {
        const id = req.body.id;
        const is_active = req.body.is_active == "true" ? false : true;;
        const user = await findByIdAndUpdate(id, { is_active: is_active });

        if (!user) {
            req.flash('error', 'Something went wrong! Please try again!');
        }

        if (user.is_active) {
            req.flash('error', `${user.info.name} has been locked!`);
        } else {
            req.flash('success', `${user.info.name} has been activated!`);
        }
        
        res.redirect('/list-user');
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
}

const blockUserInProfile = async (req, res) => {
    try {
        const id = req.body.id;
        const is_active = req.body.is_active == "true" ? false : true;;
        const user = await findByIdAndUpdate(id, { is_active: is_active });

        if (!user) {
            req.flash('error', 'Something went wrong! Please try again!');
        }

        if (user.is_active) {
            req.flash('error', `${user.info.name} has been locked!`);
        } else {
            req.flash('success', `${user.info.name} has been activated!`);
        }
        
        res.redirect(`/user-profile/${id}`);
    } catch (error) {
        res.status(409).json({success: false, data: [], error: error});
    }
}

const resetPassword = async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required(), _csrf: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) {
            req.flash('error', 'An error occured!');
        } else {
            const user = await queryOne({ "info.email": req.body.email, "login.role": "admin" })
            if (!user) {
                req.flash('error', "User with given email doesn't exist!");
            } else {
                let token = await Token.findOne({ userId: user._id });
                if (!token) {
                    token = await new Token({
                        userId: user._id,
                        token: crypto.randomBytes(32).toString("hex"),
                    }).save();
                }

                const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
                if (await sendEmail(user.info.email, "Password reset", `Click here to reset password: ${link}`)) {
                    req.flash('success', "An email has been sent, please check!");
                } else {
                    req.flash('error', "Can not send email!");
                }
            }
        }

        res.redirect(`/forgot-password`);
    } catch (err) {
        req.flash('error', 'An error occured!')
        res.redirect(`/forgot-password`);
    }
}

const getResetRequest = async (req, res) => {
    try {
        const user = req.params.userId;
        const token = req.params.token;
        const errorMessages = req.flash('error');
        res.render('persons/password-reset', { user, token, errorMessages: errorMessages, hasErrors: errorMessages.length > 0 });
    } catch (error) {
        console.log(0);
        console.log(error);
        res.status(409).json({success: false, data: [], error: error});
    }
}

const resetRequest = async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required(), 
            re_password: Joi.string().required(),
            _csrf: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) {
            req.flash('error', 'An error occured!');
        } else {
            const user = await queryById(req.params.userId)
            if (!user) {
                req.flash('error', 'Invalid link or expired!');
            } else {
                let token = await Token.findOne({
                    userId: user._id,
                    token: req.params.token,
                });
                if (!token) {
                    req.flash('error', 'Invalid link or expired!');
                } else {
                    if (req.body.password != req.body.re_password) {
                        req.flash('error', 'Passwords do not match!');
                        res.redirect(`/password-reset/${req.params.userId}/${req.params.token}`);
                        return;
                    } else {
                        user.login.password = encryptPassword(req.body.password);
                        await findByIdAndUpdate(user._id, user);
                        await token.delete();
                    }
                }
            }
        }
        req.flash('success', 'Password was changed! Please login again!');
        res.redirect(`/`);
    } catch (err) {
        console.log(1);
        console.log(err);
        res.status(409).json({success: false, data: [], error: err});
    }
}

const changePassword = async (req, res) => {
    try {
        if (!req.body.old_password || !req.body.password || !req.body.re_password) {
            req.flash('alert', "Can not update empty value!");
            res.status(200).json({ status: false, data: req.flash('alert') })
            return;
        }

        if (!validPassword(req.body.old_password, req.user.login.password)) {
            req.flash('alert', "Incorrect old password!");
            res.status(200).json({ status: false, data: req.flash('alert') })
            return;
        }

        if (req.body.password != req.body.re_password) {
            req.flash('alert', "Passwords do not match!");
            res.status(200).json({ status: false, data: req.flash('alert') })
            return;
        }

        let token = await Token.findOne({ userId: req.user.id });
        if (!token) {
            token = await new Token({
                userId: req.user.id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.BASE_URL}/password-change/${req.user.id}/${token.token}?password=${encryptPassword(req.body.password)}`;
        if (await sendEmail(req.user.info.email, "Password reset", `Click here to change password: ${link}`)) {
            req.flash('alert', "An email has been sent, please check!");
            res.status(201).json({ status: true, data: req.flash('alert') })
        } else {
            req.flash('alert', "Can not send email!");
            res.status(200).json({ status: false, data: req.flash('alert') })
        }
    } catch (err) {
        console.log(err);
        req.flash('alert', 'An error occured!')
        res.status(200).json({ status: false, data: req.flash('alert') })
    }
}

module.exports = {
    getPersons,
    getPerson,
    blockUser,
    blockUserInProfile,
    resetRequest,
    resetPassword,
    getResetRequest,
    changePassword
}