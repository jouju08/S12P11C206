import axios from 'axios';
import React from 'react';
import { Route, Router, useNavigate } from 'react-router-dom';

const navigate = useNavigate();

const authAxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  },
  withCredentials: true, //To use Cookie
});

authAxiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request Interceptors Success : ', config);

    // const accessToken = localStorage.getItem('accessToken');
    // const refreshToken = localStorage.getItem('refreshToken');

    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }

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
    //Access Token 만료 시 Refresh Token으로 재발급
    const originalRequest = error.config;
    console.log(error);

    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Cookie Refresh Token
      try {
        await axios.post('/auth/refresh', {}, { withCredentials: true });
        return authAxiosInstance(originalRequest);
      } catch (err) {
        console.log('Token refresh failed', err);
        navigate('/login'); // Router path
      }

      // const refreshToken = localStorage.getItem('refreshToken');

      // if (refreshToken) {
      //   try {
      //     const { data } = await axios.post('', { refreshToken });
      //     localStorage.setItem('accessToken', data.accessToken);
      //     originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      //     return authAxiosInstance(originalRequest);
      //   } catch (refreshError) {
      //     console.log('Refresh Token invalid: ', refreshError);
      //   }
      // }
    }

    return Promise.reject(error);
  }
);

export default authAxiosInstance;
