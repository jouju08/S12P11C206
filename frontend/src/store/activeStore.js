import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { api } from './userStore';

import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { userStore } from './userStore';

import { getFriendList } from '@/apis/friend/friendAxios';

const initialState = {
  // STOMP 관련 상태 및 액션
  friendState: [],
  userState: [],
};

const ActiveUserActions = (set, get) => ({
  //소켓 연결
  connect: async () => {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('http://192.168.100.136:8080/ws');

      console.log(socket);
      const stompClient = new Client({
        webSocketFactory: () => socket,

        onConnect: () => {
          get().subscribeMain();
          resolve(stompClient);
        },

        connectHeaders: {
          Authorization: `Bearer ${userStore.getState().accessToken}`,
        },

        onDisconnect: () => console.log('Disconnected'),
        debug: (str) => console.log(str),
      });

      stompClient.activate();

      set({ stompClient }); //Zustand의 set을 사용하여 stompClient를 상태로 저장
    });
  },

  subscribeMain: async () => {
    const friendState = getFriendList();

    console.log(friendState);

    const stompClient = get().stompClient;
    if (!stompClient || !stompClient.connected) {
      return;
    }

    stompClient.subscribe(`/active`, async (message) => {
      const newMsg = message.body;

      try {
        console.log('응답 active user', newMsg);
        const response = await api.get(
          `/active?memberId=${userStore.getState().memberId}`
        );

        console.log('찐짜임 : ', response);
        // console.log('응답1111', response);
      } catch (err) {
        console.log(err);
      }
    });
  },

  disconnect: () => {
    const stompClient = get().stompClient;
    if (stompClient && stompClient.connected) {
      stompClient.deactivate();
      console.log('STOMP client disconnected');
    }
    set({ stompClient: null });
  },

  setMyFriend: (friends) => {
    set((state) => ({ friendState: [...friends] }));
  },

  // publishMain: async () => {
  //   const stompClient = get().stompClient;

  //   if (!stompClient || !stompClient.connected) {
  //     return;
  //   }
  //   // 메세지 받기
  //   stompClient.publish({ destination: '' });
  // },
  // setParticipants: (roomId, users) =>
  //   set((state) => ({ participants: [...state.participants, participant] })),
});

const activeUserStore = create(
  devtools(
    immer((set, get) => ({
      ...initialState,
      ...ActiveUserActions(set, get),
      resetState: () => set(() => ({ ...initialState })),
    })),
    { name: 'activeUser-store' }
  )
);

export const useActiveUser = () => {
  const userState = activeUserStore((state) => state.userState, shallow);
  const friendState = activeUserStore((state) => state.friendState, shallow);

  const connect = activeUserStore((state) => state.connect);
  const subscribeMain = activeUserStore((state) => state.subscribeMain);
  const disconnect = activeUserStore((state) => state.disconnect);
  const setMyFriend = activeUserStore((state) => state.setMyFriend);

  return {
    userState,
    friendState,

    connect,
    subscribeMain,
    disconnect,
    setMyFriend,
  };
};

export { activeUserStore };
