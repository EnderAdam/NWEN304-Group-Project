const express = require('express');
const router = express.Router();
const {index, gorillaJacob} = require('../controllers/indexController');
const passport = require("passport");
const Account = require("../models/account");

router.get('/', index);
router.get('/login', gorillaJacob);
router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});
router.get('/register', function (req, res) {
    res.render('register', {});
});
router.post('/register', function (req, res) {
    Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {account: account});
        }

        passport.authenticate('local', {failureRedirect: '/'}, function (req, res,){
            res.redirect('/');
        });
    });
});
module.exports = router;
