const express = require('express'); 
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// MongoDB URI from environment variables with a fallback
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb';

if (!uri) {
  console.error('MongoDB connection URI is undefined. Please check the .env file.');
  process.exit(1); // Exit if no URI is found
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err.message));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
