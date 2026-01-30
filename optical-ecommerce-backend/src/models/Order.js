const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    prescription: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Prescription' 
    },
    customizations: {
      lensType: String,
      coating: [String],
      tint: String
    }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  paymentMethod: String,
  paymentId: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  orderNumber: { type: String, unique: true },
  notes: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Virtual for order summary
orderSchema.virtual('summary').get(function() {
  return {
    orderNumber: this.orderNumber,
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: this.totalAmount,
    status: this.orderStatus,
    paymentStatus: this.paymentStatus,
    createdAt: this.createdAt
  };
});

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);