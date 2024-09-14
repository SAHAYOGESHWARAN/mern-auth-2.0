const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Setup for Nodemailer (use your own credentials or service)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send email
const sendVerificationEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Your OTP code is: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};

// Register Controller
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP

    const newUser = new User({ email, password, otp });
    await newUser.save();
    await sendVerificationEmail(email, otp);

    res.status(201).json({ msg: 'Registered! Check your email for verification.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error registering user' });
  }
};

// Verify OTP Controller
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    if (user.otp === otp) {
      user.verified = true;
      user.otp = null;
      await user.save();
      res.status(200).json({ msg: 'Email verified successfully' });
    } else {
      res.status(400).json({ msg: 'Invalid OTP' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error verifying OTP' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (!user.verified) return res.status(400).json({ msg: 'Please verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    res.status(200).json({ msg: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error logging in' });
  }
};
