// Attach the Firebase ID token to every axios call to our backend (web port of the
// app's src/authInterceptor.js). Only for BASE_URL so the token never leaks to a
// third-party host. Imported once in main.jsx; quick5.js and every other module just
// use axios with `${BASE_URL}/api/...` URLs.
//
// Expiry: getIdToken() returns the cached token and refreshes it itself when it has
// expired or expires within 5 minutes. If the backend still answers 401 (clock skew,
// revoked session), the request is retried once with a forced refresh.
import axios from 'axios';
import { auth } from './firebase';
import { BASE_URL } from './config';

const isBackend = (url) => typeof url === 'string' && url.startsWith(BASE_URL);

const currentToken = async (forceRefresh = false) =>
  (auth?.currentUser ? auth.currentUser.getIdToken(forceRefresh) : null);

axios.interceptors.request.use(async (config) => {
  if (isBackend(config.url)) {
    const token = await currentToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(undefined, async (error) => {
  const config = error?.config;
  if (error?.response?.status === 401 && config && isBackend(config.url) && !config._retriedAuth) {
    const token = await currentToken(true).catch(() => null);
    if (token) {
      config._retriedAuth = true;
      config.headers.Authorization = `Bearer ${token}`;
      return axios(config);
    }
  }
  return Promise.reject(error);
});

// Convenience wrappers for backend routes: api.get('/api/streak').
export const api = {
  get: (path, config) => axios.get(`${BASE_URL}${path}`, config),
  post: (path, body, config) => axios.post(`${BASE_URL}${path}`, body, config),
  put: (path, body, config) => axios.put(`${BASE_URL}${path}`, body, config),
};
