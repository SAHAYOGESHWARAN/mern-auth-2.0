const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// Log the MONGO_URI to check if it's being loaded correctly
console.log('MONGO_URI:', process.env.MONGO_URI);

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MongoDB URI is not defined in the .env file');
  process.exit(1); // Stop the server if the URI is missing
}

// MongoDB connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Mounting the routes
app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);

// Server listening
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
