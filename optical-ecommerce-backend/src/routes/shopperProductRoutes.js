const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get shopper's products
router.get('/', authenticate, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new product with image upload
router.post('/', authenticate, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, brand, stock } = req.body;
    
    // Process uploaded images
    const images = req.files ? req.files.map(file => ({
      url: `/uploads/products/${file.filename}`,
      alt: name,
      isPrimary: false
    })) : [];
    
    if (images.length > 0) {
      images[0].isPrimary = true;
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      brand,
      stock: parseInt(stock),
      seller: req.user.id,
      images,
      sku: `SKU-${Date.now()}`,
      measurements: {
        lensWidth: 50,
        bridgeWidth: 20,
        templeLength: 140
      }
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product price and stock
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const { price, stock } = req.body;
    const product = await Product.findOne({ _id: req.params.id, seller: req.user.id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle product active status
router.patch('/:id/toggle', authenticate, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, seller: req.user.id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = !product.isActive;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user.id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;