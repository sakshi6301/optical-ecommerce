const express = require('express');
const { authenticate } = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

// Create Razorpay order
router.post('/create-order', authenticate, createOrder);

// Verify payment
router.post('/verify', authenticate, verifyPayment);

module.exports = router;