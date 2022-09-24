const passport = require("passport");
const Account = require("../models/account");

const index = (req, res) => {
    res.render('index', {title: 'Express'});
}

const loginGet = (req, res) => {
    res.render('login', {title: 'Login'});
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
    res.render('register', {});
};

const loginPost = passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/secret',
});

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