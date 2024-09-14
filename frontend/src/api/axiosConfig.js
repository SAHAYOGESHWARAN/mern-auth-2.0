import axios from 'axios';

// Ensure the base URL matches your backend URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
