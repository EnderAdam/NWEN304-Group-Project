const passport = require("passport");
const nodemailer = require("nodemailer");
const Account = require("../models/account");
const Token = require('../models/token');

const {
    v4: uuidv4,
} = require('uuid');

/**
 * index is the main page of the website
 * Renders the index page
 * @param req the request
 * @param res the response
 */
const index = (req, res) => {
    res.render('index', {title: 'Express'});
}

/**
 * Renders the login page
 * @param req the request
 * @param res the response
 */
const loginGet = (req, res) => {
    res.render('login', {error: ''});
}

/**
 * Logout get request for logging out the user
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
const logoutGet = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

/**
 * Renders the register page
 * @param req the request
 * @param res the response
 */
const registerGet = (req, res) => {
    res.render('register', {error: ''});
};

/**
 * Google page for logging in with Google with scope of email and profile
 * @param req the request
 * @param res the response
 */
const googlePage = (req, res) => {
    passport.authenticate('google', {scope: ['profile', 'email']})(req, res);
}

/**
 * Google callback for redirecting the user after logging in with Google
 * @param req the request
 * @param res the response
 */
const googleCallback = (req, res) => {
    passport.authenticate('google', {failureRedirect: '/login'})(req, res, function () {
        res.redirect('/');
    });
}

/**
 * Renders the page for forgot my password
 * @param req the request
 * @param res the response
 */
const forgotPasswordGet = (req, res) => {
    res.render('forgotPassword', {error: ''});
}

/**
 * Renders the reset password page
 * @param req the request
 * @param res the response
 */
const resetPasswordGet = (req, res) => {
    const {userId} = req.params;
    const {token} = req.params;
    res.render('resetPassword', {userId: userId, token: token, error: ''});
}

// Post functions

/**
 * Login post request for logging in the user
 * uses the passport local strategy to authenticate the user
 * if the user is authenticated, redirects to the home page
 * if the user is not authenticated, redirects to the login page with an error message
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
const loginPost = (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('login', {error: info.message});
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

/**
 * Register post request for registering a new user
 * Checks if the username is already taken
 * Checks if the password is strong enough
 * If the username is not taken and the password is strong enough, creates a new user
 * @param req the request
 * @param res the response
 * @returns {*} redirects to the login page if the user is created which will then lead to the homepage
 *              redirects to the register page with an error message otherwise
 */
const registerPost = (req, res) => {
    //check if the password is strong enough
    if (!passwordIsDifficultEnough(req.body.password)) {
        return res.render('register', {error: 'Password Too Weak'});
    }

    Account.register(new Account({
        username: req.body.username,
        country: req.body.country,
        region: req.body.region
    }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {account: account, error: err.message});
        }
        //create a new user
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
};

/**
 * Forgot password post request for sending an email to the user with a link to reset the password
 * @param req the request
 * @param res the response
 */
const forgotPasswordPost = (req, res) => {
    Account.findOne({username: req.body.username}, async function (err, user) {
        if (err) {
            return res.render('forgotPassword', {error: err.message});
        }
        if (user) {
            let token = await new Token({
                userId: user._id,
                token: uuidv4(),
            }).save();
            //send email
            try {
                await sendEmail(user.username, "Password reset",
                    "Click on the link to reset your password: " + process.env.BASE_URL + "/resetPassword/" + token.userId + "/" + token.token);
                return res.render('login', {error: "Email sent"});
            } catch (e) { //if the email is not sent, render the page with an error message
                return res.render('forgotPassword', {error: e.message});
            }
        }
        res.render('forgotPassword', {error: 'No user with that email address exists'});
    });
}

/**
 * Reset password post request for resetting the password of the user
 * @param req the request
 * @param res the response
 * @returns {*} redirects the same page with an error message if the password is not strong enough
 */
const resetPasswordPost = (req, res) => {
    if (!passwordIsDifficultEnough(req.body.password)) {
        return res.render('resetPassword', {error: 'Password Too Weak'});
    }
    const {userId} = req.params;
    const {token} = req.params;

    Account.findOne({_id: userId}, async function (err, user) {
        if (err) {
            return res.render('resetPassword', {error: err.message});
        }
        if (user) {
            let tokenDbArr = await Token.find({userId: user._id}); //find all tokens for the user
            for (let tokenDb of tokenDbArr) { //for each token found
                if (tokenDb.token === token) { //if the token is the same as the one in the url
                    //check the expiration date
                    if (tokenDb.createdAt.getTime() + tokenDb.expires > Date.now()) { //if the token is not expired
                        //update the password and delete the token
                        user.setPassword(req.body.password, function (err) {
                            if (err) {
                                return res.render('resetPassword', {error: err.message});
                            }
                            user.save();
                            tokenDb.remove();
                            res.render('resetPassword', {error: 'Password changed'});
                        });
                    } else {
                        //delete the token
                        tokenDb.remove();
                    }
                }
            }
        } else {
            res.render('resetPassword', {error: 'Link Invalid'});
        }
    });
}

/**
 * Function to email a user
 * @param email the email of the user
 * @param subject the subject of the email
 * @param text the text of the email
 * @returns {Promise<void>} resolves if the email is sent
 */
const sendEmail = async (email, subject, text) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });
    } catch (error) {
        throw error; //if the email is not sent, throw an error
    }
};

/**
 * Check if the request is authenticated
 * @param req the request
 * @param res the response
 * @param next the next middleware
 * @returns {*} redirects to the login page if the user is not authenticated
 */
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

/**
 * Check if the request is not authenticated
 * @param req the request
 * @param res the response
 * @param next the next middleware
 * @returns {*} redirects to the home page if the user is authenticated
 */
const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

/**
 * Check if the user who is doing the request is admin
 * @param req the request
 * @param res the response
 * @param next the next middleware
 * @returns {*} redirects to the login page if the user is not admin
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    res.redirect('/login');
}

/**
 * Checks if the password is strong enough
 * Password must be at least 5 characters long
 * Password must contain at least one uppercase and one lowercase letter
 * Password must contain at least one special character
 * @param password the password to check
 * @returns {boolean} true if the password is strong enough, false otherwise
 */
const passwordIsDifficultEnough = (password) => {
    if (password.length < 5) {
        return false;
    }
    if (password.toLowerCase() === password || password.toUpperCase() === password) {
        return false;
    }

    let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return spChars.test(password);
}

module.exports = {
    index,
    loginGet,
    logoutGet,
    registerGet,
    loginPost,
    registerPost,
    checkAuthenticated,
    checkNotAuthenticated,
    googlePage,
    googleCallback,
    isAdmin,
    forgotPasswordPost,
    forgotPasswordGet,
    resetPasswordGet,
    resetPasswordPost
}