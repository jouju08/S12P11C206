import axios from 'axios';
import React from 'react';

const authAxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, //To use Cookie
});

authAxiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request Interceptors Success : ', config);

    return config;
  },

  (error) => {
    console.log('Requset Interceptors Success : ', error);
    return Promise.reject(error);
  }
);

authAxiosInstance.interceptors.response.use(
  (res) => {
    console.log(res);
    return res;
  },

  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Access Token 만료됨, Refresh 시도...');
      try {
        await authAxiosInstance.post('/auth/refresh', {});
        console.log('Access Token 갱신 완료');
        return authAxiosInstance.request(error.config);
      } catch (refreshError) {
        console.log('Refresh Token도 만료됨, 로그아웃 처리');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default authAxiosInstance;
