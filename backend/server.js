const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express(); // Move this before the routes
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err.message));

// Mounting the routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/users', userRoutes);    // User routes

// Server listening
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
