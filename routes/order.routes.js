const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const { admin } = require('../middleware/admin.middleware');
const { createOrder, getAllOrder, getUserOrder, updateOrderStatus, deleteOrder, cancelOrder } = require('../controllers/order.controllers');

router.post('/create', auth, createOrder);
router.get('/', auth, getAllOrder);
router.get('/me', auth, getUserOrder);
router.patch('/update/:id', auth, admin, updateOrderStatus)
router.delete('/delete/:id', auth, admin, deleteOrder);
router.put("/cancel/:id", auth, cancelOrder);

module.exports = router;