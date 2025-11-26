const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { createCheckoutSession } = require('../controllers/payment.controllers');
const router = express.Router();

router.post('/create-checkout-session', auth, createCheckoutSession);

module.exports = router;