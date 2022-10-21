const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    index,
    loginGet,
    logoutGet,
    registerGet,
    loginPost,
    registerPost,
    checkNotAuthenticated,
    isAdmin,
    forgotPasswordPost,
    forgotPasswordGet,
    googlePage,
    googleCallback
} = require('../controllers/indexController');
// GET Routes
router.get('/', index);

router.get('/login', checkNotAuthenticated, loginGet);

router.get('/secret', isAdmin, secret);

router.get('/logout', logoutGet);

router.get('/register', checkNotAuthenticated, registerGet);

router.get('/oauth2/redirect/google/page', googlePage);

router.get('/oauth2/redirect/google', googleCallback);

// POST Routes
router.post('/login', loginPost);

router.post('/register', registerPost);

router.post('/forgotPassword', forgotPasswordPost);

router.get('/forgotPassword', forgotPasswordGet);

router.get('/resetPassword/:userId/:token', resetPasswordGet);

router.get('/resetPassword', resetPasswordPost);

module.exports = router;
