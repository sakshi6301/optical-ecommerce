const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1,
    default: 1 
  },
  prescription: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Prescription' 
  },
  customizations: {
    lensType: String,
    coating: [String],
    tint: String
  },
  priceAtAdd: { type: Number, required: true }, // Price when added to cart
  addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  items: [cartItemSchema],
  totalItems: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.priceAtAdd * item.quantity), 0);
  this.lastUpdated = new Date();
  next();
});

// Virtual for cart summary
cartSchema.virtual('summary').get(function() {
  return {
    totalItems: this.totalItems,
    totalAmount: this.totalAmount,
    itemCount: this.items.length,
    lastUpdated: this.lastUpdated
  };
});

cartSchema.index({ user: 1 });
cartSchema.index({ 'items.product': 1 });

module.exports = mongoose.model('Cart', cartSchema);