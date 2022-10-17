const express = require('express');
const router = express.Router();
const {purchases} = require('../controllers/accountController');
const {checkAuthenticated} = require("../controllers/indexController");

router.get('/purchases', checkAuthenticated, purchases);
module.exports = router;
