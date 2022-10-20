const express = require('express');
const router = express.Router();
const {index, create, show, update, destroy, login, authenticateToken} = require('../controllers/apiController');

router.post('/login', login);
router.get('/products/:id', show);
router.get('/products', index);
router.post('/products/create',  authenticateToken, create);
router.put('/products/:id',  authenticateToken, update);
router.delete('/products/:id',   authenticateToken, destroy);

module.exports = router;
