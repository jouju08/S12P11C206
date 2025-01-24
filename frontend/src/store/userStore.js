import { create } from 'zustand';
import authAPI from '@/apis/auth/AuthAPI';

// 잠깐 DefaultHeader 만들기 위해 변경
const initialState = {
  loginId: null,
  nickname: null,
  accessToken: null,
  isAuthenticated: false,
};

const authActions = (set) => ({
  login: (token, loginId, nickname) =>
    set({
      loginId: loginId,
      nickname: nickname,
      accessToken: token,
      isAuthenticated: true,
    }),

  logout: async () => {
    authAPI.logout();

    set({
      loginId: null,
      nickname: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {},
});

const useAuthStore = create((set, get) => ({
  ...initialState,
  ...authActions(set),
}));

export const useAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return {
    isAuthenticated,
    login,
    logout,
  };
};
