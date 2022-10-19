const express = require('express');
const router = express.Router();
const {index, newProduct, create, show, edit, update, destroy, purchase} = require('../controllers/productController');
const {checkAuthenticated, isAdmin} = require("../controllers/indexController");

router.get('/', index);
router.get('/new', isAdmin, newProduct);
router.post('/create', isAdmin, create);
router.get('/:id', show);
router.get('/:id/edit', isAdmin, edit);
router.post('/:id/update', isAdmin, update);
router.get('/:id/delete', isAdmin, destroy); // Implemented as a GET request so the browser can be redirected to the products page
router.get('/:id/purchase', checkAuthenticated, purchase);

module.exports = router;
