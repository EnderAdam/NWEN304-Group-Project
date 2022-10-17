const express = require('express');
const router = express.Router();
const {index, newProduct, create, show, edit, update, destroy, purchase} = require('../controllers/productController');
const {checkAuthenticated} = require("../controllers/indexController");

router.get('/', index);
router.get('/new', checkAuthenticated, newProduct);
router.post('/create', checkAuthenticated, create);
router.get('/:id', show);
router.get('/:id/edit', checkAuthenticated, edit);
router.post('/:id/update', checkAuthenticated, update);
router.get('/:id/delete', checkAuthenticated, destroy);
router.get('/:id/purchase', checkAuthenticated, purchase); // TODO This one needs to check authentication not admin

module.exports = router;
