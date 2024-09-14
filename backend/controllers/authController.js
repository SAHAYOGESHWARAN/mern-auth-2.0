const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registration
exports.register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.create({ email, password });

  // Send verification email
  const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
  const message = `Click here to verify your email: <a href="${verifyUrl}">Verify Email</a>`;

  await sendEmail({ email: user.email, subject: 'Email Verification', message });

  res.status(201).json({ message: 'User registered, check your email for verification link.' });
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findByIdAndUpdate(decoded.id, { isVerified: true });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  res.status(200).json({ message: 'Email verified!' });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isVerified) {
    return res.status(401).json({ message: 'Email not verified' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ token });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
  const message = `Click here to reset your password: <a href="${resetUrl}">Reset Password</a>`;

  await sendEmail({ email: user.email, subject: 'Password Reset', message });

  res.status(200).json({ message: 'Reset password email sent' });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const resetToken = req.params.token;
  const user = await User.findOne({ 
    resetPasswordToken: resetToken, 
    resetPasswordExpires: { $gt: Date.now() } 
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};
