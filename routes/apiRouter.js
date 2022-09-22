const express = require('express');
const router = express.Router();
const {create, show, update, destroy} = require('../controllers/apiController');

router.get('/:id', show);
router.post('/create', create);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
