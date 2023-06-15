import axios from 'axios';
import { interceptorError } from './refresh-token';
const axiosSubscription = axios.create({
  baseURL: process.env.API_SUBSCRIPTION + '/subs/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor
axiosSubscription.interceptors.response.use(function (response) {
  return response.data;
}, interceptorError);

axiosSubscription.interceptors.request.use(function (config) {
  const token = window?.localStorage?.getItem('access_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  config.headers['Client'] = process.env.CLIENT_ID;
  // config.url = config.url + '?client=' + process.env.CLIENT_ID;
  if (!token) return null;
  return config;
});
export const fetchSubscription = (url) => axiosSubscription.get(url);
export default axiosSubscription;
