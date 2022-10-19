const passport = require("passport");
const Account = require("../models/account");

const index = (req, res) => {
    res.render('index', {title: 'Express'});
}

const loginGet = (req, res) => {
    res.render('login', {error: ''});
}

const secret = (req, res) => {
    res.render('secret', {title: 'Secret Page'})
};

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
    passport.authenticate('google', {scope: ['profile', 'email']});
}

const googleCallback = (req, res) => {
    passport.authenticate('google', {failureRedirect: '/login'},
        res.redirect('/secret')
    );
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
            return res.redirect('secret');
        });
    })(req, res, next);
};

const passwordIsDifficultEnough = (password) => {
    if (password.length < 5) {
        return false;
    }
    if (password.toLowerCase() === password || password.toUpperCase() === password) {
        return false;
    }
    return checkIfStringHasSpecialChar(password);
}

//https://thispointer.com/javascript-check-if-string-contains-special-characters/
function checkIfStringHasSpecialChar(_string) {
    let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (spChars.test(_string)) {
        return true;
    } else {
        return false;
    }
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
            res.redirect('/secret');
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
    secret,
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