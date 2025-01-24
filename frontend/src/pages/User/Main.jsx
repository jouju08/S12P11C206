import React from 'react';
import authAPI from '@/apis/auth/AuthAPI';
import { useAuth } from '@/store/userStore';
import commonInstance from '@/apis/axios';

export default function Main() {
  const { logout } = useAuth();

  function fetchProtectedData() {
    try {
      const response = commonInstance.get('/guide');
      console.log('데이터:', response.data);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  }

  return (
    <div>
      <button
        className="bg-red-200"
        onClick={fetchProtectedData}>
        TEST COOKIE
      </button>
      <br />
      <button
        className="bg-red-200"
        onClick={logout}>
        LOGOUT
      </button>
    </div>
  );
}
