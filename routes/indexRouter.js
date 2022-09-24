const express = require('express');
const router = express.Router();
const {index, gorillaJacob} = require('../controllers/indexController');
const connectEnsureLogin = require('connect-ensure-login');
const passport = require("passport");
const Account = require("../models/account");

// GET Routes
router.get('/', index);

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) =>
    res.render('secret', { title: 'Secret Page' })
);

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

//TODO: Delete this route
router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

// POST Routes
router.post(
    '/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/secret',
    }),
    (req, res) => {
        console.log(req.user);
    }
);

// router.post('/login', passport.authenticate('local'), function (req, res) {
//     res.redirect('/');
// });

// router.get('/register', function (req, res) {
//     res.render('register', {});
// });
//
// router.post('/register', function (req, res) {
//     Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
//         if (err) {
//             return res.render('register', {account: account});
//         }
//
//         passport.authenticate('local', {failureRedirect: '/'}, function (req, res,){
//             res.redirect('/');
//         });
//     });
// });

module.exports = router;
