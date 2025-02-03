import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@/store/userStore';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { loginWithKakao, isAuthenticated } = useUser();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    const fetchTokens = async () => {
      try {
        const response = await loginWithKakao(code);
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
      }
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/main');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>로그인 중...</h1>
    </div>
  );
};

export default KakaoCallback;
