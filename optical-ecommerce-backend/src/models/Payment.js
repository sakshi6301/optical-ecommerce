const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order' 
  },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['created', 'attempted', 'paid', 'failed', 'cancelled'],
    default: 'created' 
  },
  paymentMethod: String,
  failureReason: String,
  refundId: String,
  refundAmount: Number,
  metadata: {
    items: [{
      productId: String,
      quantity: Number,
      price: Number
    }],
    shippingAddress: Object
  }
}, { 
  timestamps: true 
});

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);