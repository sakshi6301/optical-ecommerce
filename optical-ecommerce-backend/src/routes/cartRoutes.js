const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  moveToWishlist,
  getCartSummary
} = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');
const { body, param } = require('express-validator');

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// Get cart
router.get('/', getCart);

// Get cart summary (for header badge)
router.get('/summary', getCartSummary);

// Add item to cart
router.post('/add', [
  body('productId').isMongoId().withMessage('Valid product ID required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('prescription').optional().isMongoId().withMessage('Valid prescription ID required')
], addToCart);

// Update cart item
router.put('/item/:itemId', [
  param('itemId').isMongoId().withMessage('Valid item ID required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], updateCartItem);

// Remove item from cart
router.delete('/item/:itemId', [
  param('itemId').isMongoId().withMessage('Valid item ID required')
], removeFromCart);

// Move item to wishlist
router.post('/item/:itemId/move-to-wishlist', [
  param('itemId').isMongoId().withMessage('Valid item ID required')
], moveToWishlist);

// Clear entire cart
router.delete('/clear', clearCart);

module.exports = router;