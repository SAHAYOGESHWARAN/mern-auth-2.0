const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Create a transport for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found.');

    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    user.otp = otp;
    user.otpExpires = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}. It expires in 15 minutes.`
    };

    await transporter.sendMail(mailOptions);
    res.send('OTP sent to email.');
  } catch (err) {
    res.status(500).send('Server error.');
  }
});

// Example route for login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Add authentication logic here
  res.send('Login endpoint');
});

// Example route for register
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  // Add registration logic here
  res.send('Register endpoint');
});


module.exports = router;

