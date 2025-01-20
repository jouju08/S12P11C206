import { create } from 'zustand';

const initialState = {
  isAuthenticated: true,
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
