const express = require('express');
const router = express.Router();
const {create, show, update, destroy, login} = require('../controllers/apiController');

router.post('/login', login);
router.get('/products/:id', show);
router.post('/products/create', create); //TODO STUFF
router.put('/products/:id', update);
router.delete('/products/:id',  destroy);

module.exports = router;
