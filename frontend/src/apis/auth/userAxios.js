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
};

export default authAPI;
