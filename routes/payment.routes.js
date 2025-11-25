const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { createCheckoutSession, stripeWebhook } = require('../controllers/payment.controllers');
const router = express.Router();

router.post('/create-checkout-session', auth, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;