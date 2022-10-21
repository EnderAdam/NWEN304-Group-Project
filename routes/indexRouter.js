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
    forgotPasswordPost,
    forgotPasswordGet,
    googlePage,
    googleCallback, resetPasswordGet, resetPasswordPost
} = require('../controllers/indexController');
// GET Routes
router.get('/', index);

router.get('/login', checkNotAuthenticated, loginGet);

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

router.post('/resetPassword/:userId/:token', resetPasswordPost);

module.exports = router;
