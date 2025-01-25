import React from 'react';
import { Route, Link, Router, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authAxiosInstance from '@/apis/auth/AuthInstance.js';

/*
    APIs
*/

export const login = async (loginId, password) => {
  try {
    const response = await authAxiosInstance.post('/auth/login', {
      loginId,
      password,
    });

    console.log('Login successful:', response);

    if (response.statusText === 'OK') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Error In AuthAPI Login: ', error);
    throw error;
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const response = await authAxiosInstance.post('/auth/logout');
    return response;
  } catch (error) {
    console.log('Error In AuthAPI Logout: ', error);
    console.error(error);
  }
};

// 회원가입
export const register = async (loginId, password) => {
  try {
    const res = await authAxiosInstance.post('/auth/register', {
      email,
      password,
    });
    return res;
  } catch (err) {
    console.log('Error In AuthAPI Register: ', err);
    console.error(err);
  }
};

//회원가입 이메일 인증 요청
export const registerEmailSend = async (email) => {
  try {
    const res = await authAxiosInstance.post('/auth/send', { email });
    return res;
  } catch (err) {
    console.log('Error In AuthAPI RegisterEmailSend: ', err);
    console.error(err);
  }
};

//회원가입 이메일 인증 확인
export const registerEmailVerify = async (email, code) => {
  try {
    const res = await authAxiosInstance.post('/auth/vertify', { email, code });
    return res;
  } catch (err) {
    console.log('Error In AuthAPI RegisterEmailCheck: ', err);
    console.error(err);
  }
};

// 프로필(유저정보) 조회
export const profile = async (email) => {
  try {
    const res = await authAxiosInstance.get(`/member/mypage/${email}`);
    return res;
  } catch (err) {
    console.log('Error In AuthAPI Profile: ', err);
    console.error(err);
  }
};

// 프로필(유저정보) 수정
export const profileUpdate = async (email, data) => {
  try {
    const res = await authAxiosInstance.patch(`/member/mypage`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log('Error In AuthAPI ProfileUpdate: ', err);
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

export const refreshAuth = async () => {
  const response = await authAxiosInstance.post();
};

export const testAPI = async () => {
  const response = await authAxiosInstance.get(
    'http://192.168.100.136:8080/guide'
  );
  console.log('RESPONSE: ', response);
};

const authAPI = {
  login,
  logout,
  register,
  registerEmailSend,
  registerEmailVerify,
  profile,
  profileUpdate,
  unRegister,
  testAPI,
};

export default authAPI;
