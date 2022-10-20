const express = require('express');
const router = express.Router();
const {
    index,
    loginGet,
    logoutGet,
    registerGet,
    loginPost,
    registerPost,
    checkNotAuthenticated,
    isAdmin,
    googlePage,
    googleCallback
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

module.exports = router;
