const axios = require('axios');

// Axios instance configurations
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000'
});

module.exports = axiosInstance;
