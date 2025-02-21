/**
 *
 * author : Oh GwangSik (cheonbi)
 * data : 2025.01.26
 * description : 유저 인증 axios & Token 상태관리
 *
 */

import { create, useStore } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import authAPI from '@/apis/auth/userAxios';

const api = axios.create({
  baseURL: '/api',
});

let isRefreshing = false;
let refreshSubcribers = [];

const onRefreshed = (newToken) => {
  refreshSubcribers.map((callback) => callback(newToken));
  refreshSubcribers.length = 0;
};

const addRefreshSubscriber = (callback) => {
  refreshSubcribers.push(callback);
};

const decodeJWT = (token) => {
  if (!token) return null;
  const base64Url = token.split('.')[1]; // payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return JSON.parse(atob(base64));
  } catch (error) {
    return false;
  }
};

const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

const tabId = `tab-${Math.random().toString(36).substr(2, 9)}`;

const initialState = {
  loginId: '',
  nickname: '',
  memberId: '',
  profileImg: '',

  accessToken: null,
  refreshToken: null,

  isAuthenticated: false,
};
const memberInfo = [];

const userActions = (set, get) => ({
  login: async (credentials) => {
    let response;
    try {
      response = await authAPI.login(credentials);
      const { member, tokens } = response.data['data'];

      set({
        loginId: member.loginId,
        nickname: member.nickname,
        memberId: member.id,
        profileImg: member.profileImg,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isAuthenticated: true,
      });

      return response;
    } catch (error) {
      return error.response || response;
    }
  },

  loginWithKakao: async (code) => {
    try {
      const response = await authAPI.kakaologin(code);
      const { member, tokens } = response.data['data'];

      set({
        loginId: member.loginId,
        nickname: member.nickname,
        memberId: member.id,
        profileImg: member.profileImg,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isAuthenticated: true,
      });
      // axios 기본 헤더에 토큰 추가
      api.defaults.headers.common['Authorization'] =
        `Bearer ${get().accessToken}`;
      return response;
    } catch (error) {
      return error.response || response;
    }
  },

  logout: async () => {
    const { isAuthenticated } = get();

    let response;
    if (!isAuthenticated) {

    } else {
      try {
        response = await authAPI.logout();
      } catch (error) {
        return error.response || response;
      }
    }

    set({
      loginId: '',
      nickname: '',
      memberId: '',
      accessToken: '',
      refresgetStatehToken: '',
      isAuthenticated: false,
    });

    return;
  },

  refreshAccessToken: async () => {
    const { refreshToken, logout } = get();
    if (!refreshToken) {
      logout();
      return;
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          resolve(newToken);
        });
      });
    }

    isRefreshing = true;

    try {


      const response = await authAPI.refresh({ refreshToken });
      const data = response.data;

      if (data.status === 'SU') {
        isRefreshing = false;
        const accessToken = data.data.accessToken;
        onRefreshed(accessToken);



        set({ accessToken: accessToken });

        return accessToken;
      } else if (data.status === 'SER') {


        set({
          loginId: '',
          nickname: '',
          memberId: '',
          accessToken: '',
          refreshToken: '',
          isAuthenticated: false,
        });

        return false;
      }
    } catch (error) {
      isRefreshing = false;


      set({
        loginId: '',
        nickname: '',
        memberId: '',
        accessToken: '',
        refreshToken: '',
        isAuthenticated: false,
      });

      return Promise.reject(error);
    }
  },

  fetchUser: async () => {
    const { accessToken, refreshToken, refreshAccessToken, logout } = get();

    if (!accessToken) {


      if (refreshToken) {
        try {
          await refreshAccessToken();
        } catch (error) {
          logout();
        }
      } else {
        logout();
      }
    } else {
      if (isTokenExpired(accessToken)) {
        await refreshAccessToken();
      }
    }
  },

  //중복확인
  duplicate: async (type, value) => {
    try {
      const response = await authAPI.checkDuplicate(type, value);
      return response.data;
    } catch (error) {

      if (error.response) {

      } else if (error.request) {

      } else {

      }
      throw error;
    }
  },

  //인증번호 전송
  sendEmail: async (email) => {

    try {
      const response = await authAPI.sendEmailAuthenticate(email);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  //이메일 인증
  emailAuthenticate: async (email, authNum) => {
    try {
      const response = await authAPI.postEmailAuthenticate(email, authNum);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (credentials) => {
    let response;
    try {
      response = await authAPI.register(credentials);
      return response;
    } catch (error) {
      return error.response || response;
    }
  },

  myPage: async () => {
    try {
      const response = await authAPI.getMemberInfo();
      set({ memberInfo: response.data.data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  findId: async (payload) => {
    try {
      const response = await authAPI.findId(payload);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  findPassword: async (payload) => {
    try {
      const response = await authAPI.findPassword(payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
});

const userStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        ...userActions(set, get),
      }),
      {
        name: `user-store`,
        storage: createJSONStorage(() => sessionStorage),
      }
    ),
    { name: `Auth Store ${tabId}` }
  )
);

export const useUser = () => {
  const loginId = userStore((state) => state.loginId);
  const nickname = userStore((state) => state.nickname);
  const memberId = userStore((state) => state.memberId);
  const profileImg = userStore((state) => state.profileImg);
  const accessToken = userStore((state) => state.accessToken);
  const refreshToken = userStore((state) => state.refreshToken);
  const isAuthenticated = userStore((state) => state.isAuthenticated);

  const login = userStore((state) => state.login);
  const loginWithKakao = userStore((state) => state.loginWithKakao);
  const logout = userStore((state) => state.logout);
  const refreshAccessToken = userStore((state) => state.refreshAccessToken);
  const fetchUser = userStore((state) => state.fetchUser);

  const duplicate = userStore((state) => state.duplicate);
  const sendEmail = userStore((state) => state.sendEmail);
  const emailAuthenticate = userStore((state) => state.emailAuthenticate);
  const register = userStore((state) => state.register);
  const myPage = userStore((state) => state.myPage);
  const memberInfo = userStore((state) => state.memberInfo);
  const findId = userStore((state) => state.findId);
  const findPassword = userStore((state) => state.findPassword);

  return {
    loginId,
    nickname,
    memberId,
    profileImg,
    accessToken,
    refreshToken,
    isAuthenticated,

    login,
    loginWithKakao,
    logout,
    refreshAccessToken,
    fetchUser,
    duplicate,
    sendEmail,
    emailAuthenticate,
    register,
    myPage,
    memberInfo,
    findId,
    findPassword,
  };
};

export { api };
export { userStore };

api.interceptors.request.use(
  (request) => {
    //refreshToken 분기
    if (request.url === '/auth/refresh') {
      return request;
    }

    const accessToken = userStore.getState().accessToken;
    if (!isTokenExpired(accessToken) && accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`;
      return request;
    } else {
      return request;
    }
  },
  (error) => {
    return error;
  }
);

//interceptor
api.interceptors.response.use(
  (response) => {

    if (response.data.status === 'SU') {
      return response;
    } else {
      return response;
    }
  },

  async (error) => {
    const { refreshAccessToken, logout } = userStore.getState();
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //재발급 요청전 Bearer 제거
        delete api.defaults.headers.common['Authorization'];

        await refreshAccessToken(); //재발급

        originalRequest.headers['Authorization'] =
          `Bearer ${userStore.getState().accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        //refreshToken도 401 - 403

        logout();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {

      logout();
    }

    return Promise.reject(error);
  }
);
