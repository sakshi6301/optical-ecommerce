const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['frames', 'sunglasses', 'lenses', 'contact-lenses'],
    required: true 
  },
  brand: { type: String, required: true },
  model: String,
  sku: { type: String, unique: true, required: true },
  
  // Seller reference
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Frame-specific fields
  frameDetails: {
    type: { 
      type: String, 
      enum: ['full-rim', 'half-rim', 'rimless', 'clip-on'] 
    },
    material: { 
      type: String, 
      enum: ['acetate', 'metal', 'titanium', 'plastic', 'wood', 'carbon-fiber'] 
    },
    shape: { 
      type: String, 
      enum: ['round', 'square', 'rectangular', 'oval', 'cat-eye', 'aviator', 'wayfarer'] 
    },
    color: String,
    pattern: String,
    weight: Number, // in grams
    flexibility: { type: String, enum: ['rigid', 'flexible', 'memory'] }
  },
  
  // Size measurements (in mm)
  measurements: {
    lensWidth: { type: Number, required: true },
    bridgeWidth: { type: Number, required: true },
    templeLength: { type: Number, required: true },
    lensHeight: Number,
    frameWidth: Number,
    totalWidth: Number
  },
  
  // Lens-specific fields
  lensDetails: {
    type: { 
      type: String, 
      enum: ['single-vision', 'bifocal', 'progressive', 'reading', 'computer', 'transition'] 
    },
    material: { 
      type: String, 
      enum: ['cr39', 'polycarbonate', 'high-index', 'trivex', 'glass'] 
    },
    coating: [{ 
      type: String, 
      enum: ['anti-reflective', 'scratch-resistant', 'uv-protection', 'blue-light', 'photochromic'] 
    }],
    tint: String,
    thickness: Number,
    index: { type: Number, enum: [1.5, 1.56, 1.61, 1.67, 1.74] },
    prescription: {
      sphereRange: { min: Number, max: Number },
      cylinderRange: { min: Number, max: Number },
      addRange: { min: Number, max: Number }
    }
  },
  
  // Contact lens specific
  contactLensDetails: {
    type: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly', 'yearly'] 
    },
    material: { 
      type: String, 
      enum: ['hydrogel', 'silicone-hydrogel'] 
    },
    waterContent: Number, // percentage
    diameter: Number,
    baseCurve: Number,
    powerRange: { min: Number, max: Number },
    cylinderAvailable: Boolean,
    multifocalAvailable: Boolean
  },
  
  // General product info
  gender: { 
    type: String, 
    enum: ['men', 'women', 'unisex', 'kids'] 
  },
  ageGroup: { 
    type: String, 
    enum: ['adult', 'teen', 'kids', 'senior'] 
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Inventory
  stock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  
  // Features and benefits
  features: [String],
  benefits: [String],
  suitableFor: [{ 
    type: String, 
    enum: ['reading', 'computer-work', 'driving', 'sports', 'fashion', 'outdoor'] 
  }],
  
  // Pricing
  originalPrice: Number,
  discountPercentage: { type: Number, default: 0 },
  
  // Status
  isActive: { type: Boolean, default: true },
  isNew: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  
  // SEO
  seoTitle: String,
  seoDescription: String,
  tags: [String],
  
  // Reviews
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  suppressReservedKeysWarning: true
});

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function() {
  if (this.discountPercentage > 0) {
    return this.price * (1 - this.discountPercentage / 100);
  }
  return this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Index for search optimization
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ seller: 1 });

module.exports = mongoose.model('Product', productSchema);