const express = require('express');
const router = express.Router();
const {create, show, update, destroy} = require('../controllers/apiController');

router.get('/products/:id', show);
router.post('/products/create', create); //TODO STUFF
router.put('/products/:id', update);
router.delete('/products/:id',  destroy);

module.exports = router;
