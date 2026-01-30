const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token or inactive user.' });
    }

    if (user.isLocked) {
      return res.status(423).json({ message: 'Account is locked. Try again later.' });
    }

    req.user = { 
      userId: user._id, 
      role: user.role, 
      email: user.email,
      isVerified: user.isEmailVerified 
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    res.status(401).json({ message: 'Invalid token.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

exports.requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ message: 'Email verification required.' });
  }
  next();
};

exports.requireSellerVerification = async (req, res, next) => {
  try {
    if (req.user.role !== 'seller') {
      return next();
    }
    
    const user = await User.findById(req.user.userId);
    if (!user.sellerInfo?.isVerified) {
      return res.status(403).json({ message: 'Seller verification required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateToken = generateToken;