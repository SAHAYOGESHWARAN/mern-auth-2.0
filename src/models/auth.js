const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator"); // For email and other input validation

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [3, "First name must be at least 3 characters"],
    maxlength: [20, "First name cannot exceed 20 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minlength: [3, "Last name must be at least 3 characters"],
    maxlength: [20, "Last name cannot exceed 20 characters"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
    lowercase: true,
    index: true,
    minlength: [3, "Username must be at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  hash_password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  contactNumber: {
    type: String,
    validate: {
      validator: (v) => validator.isMobilePhone(v),
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
  profilePicture: {
    type: String,
    default: "default-profile-pic.jpg", // Set a default profile picture if none is provided
  },
  isVerified: {
    type: Boolean,
    default: false, // Email verification status
  },
  emailToken: {
    type: String, // Token for email verification
  },
  resetPasswordToken: {
    type: String, // Token for password reset
  },
  resetPasswordExpires: {
    type: Date, // Expiration time for password reset token
  },
}, { timestamps: true });

// Virtual for user's full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Method for password comparison
userSchema.methods.authenticate = async function (password) {
  return await bcrypt.compare(password, this.hash_password);
};

// Pre-save hook for hashing passwords before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("hash_password")) {
    return next();
  }

  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.hash_password = await bcrypt.hash(this.hash_password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Generate an email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  // Generate a token and assign it to the emailToken field
  this.emailToken = shortid.generate(); // You can also use other token generators
};

// Generate a password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = shortid.generate();
  this.resetPasswordToken = bcrypt.hashSync(resetToken, 10);
  this.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
