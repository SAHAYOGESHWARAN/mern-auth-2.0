import axios from 'axios';

// Set the base URL for all requests
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',  // Backend URL
});

export default axiosInstance;
