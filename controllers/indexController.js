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

const registerPost = (req, res) => {
    Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
        if (err) {
            console.log(err);
            return res.render('register', {account: account, error: err});
        }
        //create a new user
        passport.authenticate('local')(req, res, function () {
            res.redirect('/secret');
        });
    });
};

module.exports = {
    index, loginGet, secret, logoutGet, registerGet, loginPost, registerPost
}