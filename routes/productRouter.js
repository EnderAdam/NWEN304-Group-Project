const express = require('express');
const router = express.Router();
const {index, newProduct, create, show, edit, update, destroy} = require('../controllers/productController');

router.get('/', index);
router.get('/new', newProduct);
router.post('/create', create);
router.get('/:id', show);
router.get('/:id/edit', edit);
router.post('/:id/update', update);
router.get('/:id/delete', destroy);

module.exports = router;
