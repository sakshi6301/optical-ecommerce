const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, items, shippingAddress } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create payment record
    const payment = new Payment({
      userId: req.user.userId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency,
      status: 'created',
      metadata: { items, shippingAddress }
    });

    await payment.save();

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid'
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    // Create order in database
    const order = new Order({
      userId: payment.userId,
      items: payment.metadata.items,
      totalAmount: payment.amount,
      shippingAddress: payment.metadata.shippingAddress,
      paymentStatus: 'paid',
      paymentMethod: 'razorpay',
      paymentId: razorpay_payment_id,
      orderStatus: 'confirmed'
    });

    await order.save();

    // Update payment with order reference
    payment.orderId = order._id;
    await payment.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
      orderId: order._id,
      orderNumber: order.orderNumber
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};