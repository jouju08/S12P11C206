import axios from 'axios';

function getAccessTokenFromCookie() {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'accessToken') {
      return value;
    }
  }
  return null;
}

const commonInstance = axios.create({
  baseURL: 'http://192.168.100.136:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

commonInstance.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default commonInstance;
