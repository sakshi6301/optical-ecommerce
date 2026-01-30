const express = require('express');
const { 
  createOrder, 
  getUserOrders, 
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const { body, param } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Place order
router.post('/', [
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('items.*.product').isMongoId().withMessage('Valid product ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], createOrder);

// User order routes
router.get('/user', getUserOrders); // GET /api/orders/user - order history
router.get('/user/:id', getOrderById); // GET /api/orders/user/:id - single order

// Admin routes
router.get('/admin', authorize('admin'), getAllOrders); // GET /api/orders/admin - all orders
router.put('/admin/:id/status', [
  param('id').isMongoId().withMessage('Valid order ID required'),
  body('orderStatus').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid order status')
], authorize('admin'), updateOrderStatus); // PUT /api/orders/admin/:id/status

// Cancel order
router.put('/:id/cancel', [
  param('id').isMongoId().withMessage('Valid order ID required')
], cancelOrder);

module.exports = router;