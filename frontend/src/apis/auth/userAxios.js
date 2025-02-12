import { api } from '@/store/userStore';

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
};

export default authAPI;
