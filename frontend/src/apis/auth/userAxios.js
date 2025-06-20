/**
 * author : Oh GwangSik (cheonbi)
 * data : 2025.02.18
 * description : 유저 API
 * React -> SpringBoot
 */

import { api } from '@/store/userStore';
import axios from 'axios';

const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  kakaologin: (code) =>
    api.get(`/auth/kakao/callback`, {
      params: {
        code: code,
      },
    }),

  logout: () => api.post('/auth/logout'),

  refresh: (data) => api.post('/auth/refresh', data),
  checkDuplicate:(type,value)=> api.get(`/auth/duplicate/check-${type}/${value}`),//중복확인
  sendEmailAuthenticate:(email)=>api.post("/auth/email/send",{"email":email}),//이메일 전송
  postEmailAuthenticate:(email, authNum)=>api.post("/auth/email/verify",//이메일 인증
    {"email":email,
      "authNum":authNum
      }
  ),
  register:(credentials)=>api.post(`/auth/register`, credentials),
  getMemberInfo:()=>api.get("/member/mypage"),
  findId:(payload)=>axios.post("/api/auth/find-id", payload),
  findPassword:(payload)=>axios.patch("/api/auth/find-password", payload),
};

export default authAPI;
