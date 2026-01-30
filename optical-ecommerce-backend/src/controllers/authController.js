const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role = 'customer' } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ 
      name, 
      email, 
      password, 
      role,
      emailVerificationToken: crypto.randomBytes(32).toString('hex')
    });
    await user.save();

    const token = generateToken({ 
      userId: user._id, 
      role: user.role, 
      email: user.email 
    });
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name, 
        email, 
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      message: 'Registration successful. Please verify your email.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    if (user.isLocked) {
      return res.status(423).json({ message: 'Account is locked. Try again later.' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      await user.incLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    const token = generateToken({ 
      userId: user._id, 
      role: user.role, 
      email: user.email 
    });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email, 
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    const token = generateToken({ 
      userId: user._id, 
      role: user.role, 
      email: user.email 
    });
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // In production, send email with reset link
    res.json({ 
      message: 'Password reset token sent',
      resetToken // Remove this in production
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = undefined;
    user.lockUntil = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};