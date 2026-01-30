const express = require('express');
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getSellerProducts
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Seller routes
router.post('/', authenticate, authorize('seller', 'admin'), createProduct);
router.put('/:id', authenticate, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', authenticate, authorize('seller', 'admin'), deleteProduct);
router.get('/seller/my-products', authenticate, authorize('seller', 'admin'), getSellerProducts);

module.exports = router;