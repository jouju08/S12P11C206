import React from 'react';
import { Route, Link, Router, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authAxiosInstance from './AuthInstance';

const navigate = useNavigate();

//interceptors
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

authAxiosInstance.interceptors.response.use((response) => {
  console.log('Response Interceptors Success : ', response);
  async (error) => {
    //Access Token 만료 시 Refresh Token으로 재발급
    const originalRequest = error.config;
    console.log(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          await authAxiosInstance.post('', { refreshToken });
          return authAxiosInstance(originalRequest);
        } catch (refreshError) {
          console.log('Refresh Token invalid: ', refreshError);
          navigate('/login');
        }
      }
    }

    console.log('Response Interceptors Error : ', error);
    return Promise.reject(error);
  };
});

/*
    APIs

*/

export const login = async (email, password) => {
  try {
    const response = authAxiosInstance.post('/login', { email, password });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.log('Error In AuthAPI Login: ', error);
    throw error;
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const response = authAxiosInstance.post('/logout');
    Router.push('/login');
    return response;
  } catch (error) {
    console.log('Error In AuthAPI Logout: ', error);
    console.error(error);
  }
};

// 회원가입
export const register = async (email, password) => {
  try {
    const res = authAxiosInstance.post('/register', { email, password });
    return res;
  } catch (err) {
    console.log('Error In AuthAPI Register: ', err);
    console.error(err);
  }
};

// 프로필(유저정보)
export const profile = async (email, password) => {
  try {
    const res = authAxiosInstance.get('/profile');
    return res;
  } catch (err) {
    console.log('Error In AuthAPI Profile: ', err);
    console.error(err);
  }
};

// 회원탈퇴
export const unRegister = async () => {
  try {
    const res = authAxiosInstance.delete('/unRegister');
    return res;
  } catch (err) {
    console.log('Error In AuthAPI Unregister: ', err);
    console.error(err);
  }
};
