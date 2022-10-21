const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    index,
    loginGet,
    logoutGet,
    secret,
    registerGet,
    loginPost,
    registerPost,
    checkNotAuthenticated, forgotPasswordPost, forgotPasswordGet, isAdmin, resetPasswordGet, resetPasswordPost
} = require('../controllers/indexController');
// GET Routes
router.get('/', index);

router.get('/login', checkNotAuthenticated, loginGet);

router.get('/secret', isAdmin, secret);

router.get('/logout', logoutGet);

router.get('/register', checkNotAuthenticated, registerGet);

//TODO: Move the following functions to indexController.js
router.get('/oauth2/redirect/google/page',
    passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get('/oauth2/redirect/google',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/secret');
    }
);

// POST Routes
router.post('/login', loginPost);

router.post('/register', registerPost);

router.post('/forgotPassword', forgotPasswordPost);

router.get('/forgotPassword', forgotPasswordGet);

router.get('/resetPassword/:userId/:token', resetPasswordGet);

router.post('/resetPassword/:userId/:token', resetPasswordPost);

module.exports = router;
