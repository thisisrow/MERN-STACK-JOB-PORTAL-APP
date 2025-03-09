import axios from 'axios';

axios.defaults.baseURL = "https://mern-stack-job-portal-app.onrender.com";

// Add a request interceptor for handling tokens
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios; 