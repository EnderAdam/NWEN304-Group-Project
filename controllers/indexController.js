const passport = require("passport");
const Account = require("../models/account");

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
    isAdmin
}