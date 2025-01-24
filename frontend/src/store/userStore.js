import { create } from 'zustand';

// 잠깐 DefaultHeader 만들기 위해 변경
const initialState = {
  isAuthenticated: false,
};

const authActions = (set) => ({
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
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
