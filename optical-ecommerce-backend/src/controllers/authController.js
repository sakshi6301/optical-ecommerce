const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { AppError } = require('../middleware/errorHandler');
const crypto = require('crypto');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'customer' } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists', 400);
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
  
  ApiResponse.created(res, {
    token, 
    user: { 
      id: user._id, 
      name, 
      email, 
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
  }, 'Registration successful');
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  if (user.isLocked) {
    throw new AppError('Account is locked. Try again later.', 423);
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    await user.incLoginAttempts();
    throw new AppError('Invalid credentials', 401);
  }

  await user.resetLoginAttempts();

  const token = generateToken({ 
    userId: user._id, 
    role: user.role, 
    email: user.email 
  });
  
  ApiResponse.success(res, {
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email, 
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      lastLogin: user.lastLogin
    }
  }, 'Login successful');
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user || !user.isActive) {
    throw new AppError('Invalid user', 401);
  }

  const token = generateToken({ 
    userId: user._id, 
    role: user.role, 
    email: user.email 
  });
  
  ApiResponse.success(res, { token }, 'Token refreshed');
});

exports.logout = asyncHandler(async (req, res) => {
  ApiResponse.success(res, null, 'Logged out successfully');
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) {
    throw new AppError('Invalid verification token', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  ApiResponse.success(res, null, 'Email verified successfully');
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  ApiResponse.success(res, { resetToken }, 'Password reset token sent');
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.loginAttempts = undefined;
  user.lockUntil = undefined;
  await user.save();

  ApiResponse.success(res, null, 'Password reset successful');
});