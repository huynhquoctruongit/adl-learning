import axios from 'axios';


const axiosClient = axios.create({
  baseURL: process.env.API_URL + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.request.use(function (config) {
  const token = window?.localStorage?.getItem('access_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

export default axiosClient;
