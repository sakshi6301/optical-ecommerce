const express = require('express');
const { 
  register, 
  login, 
  refreshToken, 
  logout, 
  verifyEmail, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();

// Registration
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'seller', 'admin']).withMessage('Invalid role')
], register);

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Token refresh
router.post('/refresh', authenticate, refreshToken);

// Logout
router.post('/logout', authenticate, logout);

// Email verification
router.get('/verify-email/:token', verifyEmail);

// Password reset
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], forgotPassword);

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], resetPassword);

module.exports = router;