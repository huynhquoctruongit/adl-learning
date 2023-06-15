import axios from 'axios';

export let isRefreshing = false;
export let refreshSubscribers = [];
let callbackErrorAuthentication = () => {};

axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const updateIsRefreshing = (value) => {
  isRefreshing = value;
};
export const updateRefreshSubscribers = (value) => {
  refreshSubscribers = value;
};

export const refreshAccessToken = async () => {
  const refresh_token = window.localStorage.getItem('refresh_token');
  return await axios.get(
    process.env.API_INTERACTION + '/interaction/public/renew_token?refresh_token=' + refresh_token
  );
};

export function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

export function onRrefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export const constructCallBack = (handle) => {
  callbackErrorAuthentication = handle;
};

export async function interceptorError(error) {
  const expires_at = window.localStorage.getItem('expires_at') || 0;
  console.log(error?.response);
  if (error?.response.status === 401) {
    const originalRequest = error.config;
    const retryOrigReq = new Promise((resolve, reject) => {
      subscribeTokenRefresh((token) => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        resolve(axios(originalRequest));
      });
    });

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const old_refresh_token = window.localStorage.getItem('refresh_token');
        if (!old_refresh_token) {
          // debugger;
          isRefreshing = false;
          // callbackErrorAuthentication();
          console.log(error);
          return Promise.reject(error);
        }
        const result = await refreshAccessToken();
        const { access_token, refresh_token, expires_in } = result?.token || {};
        window.localStorage.setItem('refresh_token', refresh_token);
        window.localStorage.setItem('access_token', access_token);
        window.localStorage.setItem('expires_at', new Date().getTime() / 1000 + expires_in);
        isRefreshing = false;
        onRrefreshed(access_token);
        console.log('error');
      } catch (error) {
        console.log(error);
        isRefreshing = false;
        window.localStorage.removeItem('refresh_token');
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('expires_at');

        callbackErrorAuthentication();
        return Promise.reject(error);
      }
    }
    return retryOrigReq;
  } else {
    return Promise.reject(error);
  }
}
