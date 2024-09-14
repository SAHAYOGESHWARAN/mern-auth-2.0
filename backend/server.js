const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load .env file before accessing environment variables
dotenv.config({ path: '../.env' });  

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MongoDB URI is not defined in the .env file');
  process.exit(1);
}

// MongoDB connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/users', userRoutes);

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
