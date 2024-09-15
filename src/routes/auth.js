const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controller/auth"); // Correct imports from controller
const {
  validateSignUpRequest,
  validateSignInRequest,
  isRequestValidated,
} = require("../validators/auth"); // Correct imports from validators
const rateLimit = require("express-rate-limit");

// Rate limiter to prevent brute force attacks on authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom async error handler to handle async errors globally
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// SignIn route with validation, rate-limiting, and error handling
router.post(
  "/signin",
  authLimiter, // Apply rate limiting to login route
  validateSignInRequest,
  isRequestValidated,
  asyncHandler(signIn)
);

// SignUp route with validation and error handling
router.post(
  "/signup",
  validateSignUpRequest,
  isRequestValidated,
  asyncHandler(signUp)
);

// Global error handler to catch all errors
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

module.exports = router;
