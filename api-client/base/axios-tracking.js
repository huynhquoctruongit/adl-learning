import axios from 'axios';

export const axiosTracking = axios.create({
  baseURL: process.env.API_TRACKING || "https://tracking.icankid.io",
  headers: {
    'Content-Type': 'application/json'
  }
});
export default axiosTracking;
