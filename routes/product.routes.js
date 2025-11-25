const express = require('express');
const { admin } = require('../middleware/admin.middleware');
const { auth } = require('../middleware/auth.middleware');
const { createProducts, getSingleProduct, getProduct, deleteProduct, updateProduct } = require('../controllers/product.controllers');
const router = express.Router();

router.post('/create', auth, admin, createProducts);
router.get('/:id', getSingleProduct);
router.get('/', getProduct);
router.delete('/delete/:id', auth, admin, deleteProduct);
router.put('/update/:id', auth, admin, updateProduct);

module.exports = router;