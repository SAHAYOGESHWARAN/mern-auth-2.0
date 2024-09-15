const { StatusCodes } = require("http-status-codes");
const User = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
// const sendVerificationEmail = require("../utils/emailVerification"); // Utility function for sending email

// Sign Up Function with Email Verification
const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Basic input validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all required information",
    });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User already registered",
      });
    }

    // Hash the password
    const hash_password = await bcrypt.hash(password, 10);

    // Create a verification token
    const emailToken = shortid.generate();

    // Prepare user data
    const userData = {
      firstName,
      lastName,
      email,
      hash_password,
      emailToken,
      isVerified: false, // For email verification
    };

    // Create the user in the database
    const newUser = await User.create(userData);

    // Send verification email (assuming sendVerificationEmail is a utility)
    sendVerificationEmail(newUser.email, emailToken);

    return res.status(StatusCodes.CREATED).json({
      message: "User created successfully. Please verify your email.",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error while registering user",
      error: error.message,
    });
  }
};

// Sign In Function with Enhanced Security
const signIn = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password input
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please enter email and password",
    });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User does not exist",
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Please verify your email before signing in",
      });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.hash_password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { _id, firstName, lastName, email: userEmail, role, fullName } = user;
    return res.status(StatusCodes.OK).json({
      token,
      user: { _id, firstName, lastName, email: userEmail, role, fullName },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong during sign in",
      error: error.message,
    });
  }
};

module.exports = { signUp, signIn };
