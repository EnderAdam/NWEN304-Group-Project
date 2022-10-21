const passport = require("passport");
const Account = require("../models/account");
const sendEmail = require("./sendEmail");
const Token = require('../models/token');

const {
    v4: uuidv4,
} = require('uuid');

const index = (req, res) => {
    res.render('index', {title: 'Express'});
}

const loginGet = (req, res) => {
    res.render('login', {error: ''});
}

const logoutGet = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

const registerGet = (req, res) => {
    res.render('register', {error: ''});
};

const googlePage = (req, res) => {
    passport.authenticate('google', {scope: ['profile', 'email']})(req, res);
}

const googleCallback = (req, res) => {
    passport.authenticate('google', {failureRedirect: '/login'})(req, res, function () {
        res.redirect('/');
    });
}

// Post functions

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

const registerPost = (req, res) => {
    //check if the password is strong enough
    if (!passwordIsDifficultEnough(req.body.password)) {
        return res.render('register', {error: ''});
    }

    Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
        if (err) {
            console.log(err);
            return res.render('register', {account: account, error: err.message});
        }
        //create a new user
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
};

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next();
    }
    res.redirect('/login');
}

const forgotPasswordPost = (req, res) => {
    Account.findOne({username: req.body.username}, async function (err, user) {
        if (err) {
            console.log(err);
            return res.render('forgotPassword', {error: err.message});
        }
        if (user) {
            let token = await new Token ({
                userId: user._id,
                token: uuidv4(),
            }).save();
            //send email
            try {
                await sendEmail(user.username, "Password reset",
                    "Click on the link to reset your password: " + process.env.BASE_URL + "/resetPassword/" + token.userId + "/" + token.token);
                return res.render('login', {error: "Email sent"});
            } catch (e) {
                console.log(e);
                return res.render('forgotPassword', {error: e.message});
            }
        }
        res.render('forgotPassword', {error: 'No user with that email address exists'});
    });
}

const forgotPasswordGet = (req, res) => {
    res.render('forgotPassword', {error: ''});
}

const resetPasswordGet = (req, res) => {
    const {userId} = req.params;
    const {token} = req.params;
    res.render('resetPassword', {userId: userId, token: token, error: ''});
}

const resetPasswordPost = (req, res) => {
    const {userId} = req.params;
    const {token} = req.params;

    console.log(userId + " " + token);
    Account.findOne({_id: userId}, async function (err, user) {
        if (err) {
            console.log(err);
            return res.render('resetPassword', {error: err.message});
        }
        if (user) {
            console.log("User found");
            let tokenDbArr = await Token.find({userId: user._id}); //find all tokens for the user
            for (let tokenDb of tokenDbArr) { //for each token found
                console.log(tokenDb.token);
                if (tokenDb.token === token) { //if the token is the same as the one in the url
                    //check the expiration date
                    if (tokenDb.createdAt.getTime() + tokenDb.expires > Date.now()) { //if the token is not expired
                        console.log("Token not expired");
                        //update the password and delete the token
                        user.setPassword(req.body.password, function (err) {
                            if (err) {
                                console.log(err);
                                return res.render('resetPassword', {error: err.message});
                            }
                            user.save();
                            tokenDb.remove();
                            // return res.render('login', {error: "Password changed"});
                        });
                    } else {
                        //delete the token
                        tokenDb.remove();
                        console.log("Token expired");
                    }
                }
            }
        }
        res.render('resetPassword', {error: 'Link Invalid'});
    });
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