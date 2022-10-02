const express = require('express');
const router = express.Router();
const {
    index,
    loginGet,
    logoutGet,
    secret,
    registerGet,
    loginPost,
    registerPost,
    checkAuthenticated, checkNotAuthenticated
} = require('../controllers/indexController');
require('connect-ensure-login');
// GET Routes
router.get('/', index);

router.get('/login', checkNotAuthenticated, loginGet);

router.get('/secret', checkAuthenticated, secret);

router.get('/logout', logoutGet);

router.get('/register', checkNotAuthenticated, registerGet);

//TODO: Delete this route
router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

// POST Routes
router.post('/login', loginPost);

router.post('/register', registerPost);

module.exports = router;
