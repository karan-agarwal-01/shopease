const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { addToCart, getCart, updateQuantity, removeCart, clearCart } = require('../controllers/cart.controllers');
const router = express.Router();

router.post('/add', auth, addToCart);
router.get('/', auth, getCart);
router.put('/update', auth, updateQuantity);
router.delete('/remove', auth, removeCart);
router.delete('/clear', auth, clearCart);

module.exports = router;