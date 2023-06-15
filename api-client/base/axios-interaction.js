import axios from 'axios';
import { interceptorError } from './refresh-token';

export const axiosInteraction = axios.create({
  baseURL: process.env.API_INTERACTION + '/interaction/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInteraction.interceptors.response.use(function (response) {
  return response.data;
}, interceptorError);

axiosInteraction.interceptors.request.use(function (config) {
  const token = window?.localStorage?.getItem('access_token');
  if (config.method === 'post' && config.data.interact)
    config.url = config.url + (config.url.includes('?') ? '&' : '?') + 'view=' + window.location.pathname;
  if (token) config.headers.Authorization = 'Bearer ' + token;
  if (!token) return null;
  return config;
});

export const fetchInteract = (url) => axiosInteraction.get(url);
export default axiosInteraction;
