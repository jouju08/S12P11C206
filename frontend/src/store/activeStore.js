import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { api } from './userStore';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { userStore } from './userStore';
import { useRoomStore } from './roomStore.js';
import { getFriendList } from '@/apis/friend/friendAxios';

const ACTIVE_SOCKET_URL = import.meta.env.VITE_WS_URL_LOCAL;

const initialState = {
  friendState: [],
  userState: [],
  inviteInfo: [],
};

const ActiveUserActions = (set, get) => ({
  //소켓 연결
  connect: async () => {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('/ws');


      const stompClient = new Client({
        webSocketFactory: () => socket,

        onConnect: () => {
          resolve(stompClient);
        },

        connectHeaders: {
          Authorization: `Bearer ${userStore.getState().accessToken}`,
        },

        onDisconnect: () => {},
        onStompError: (frame) => {

        },

      });

      stompClient.activate();

      set({ stompClient }); //Zustand의 set을 사용하여 stompClient를 상태로 저장
    });
  },

  subscribeMain: async () => {
    const friendState = getFriendList();

    const stompClient = get().stompClient;
    if (!stompClient || !stompClient.connected) {
      return;
    }

    stompClient.subscribe(`/active`, async (message) => {
      const newMsg = message.body;


      try {
        const response = await api.get(
          `/active?memberId=${userStore.getState().memberId}`
        );
      } catch (err) {
        return err;
      }
    });

    stompClient.subscribe(`/active/invite`, async (message) => {
      const inviteMsg = message.body;

      if (inviteMsg) {
        const roomId = JSON.parse(inviteMsg).roomId; // string type
        const memberId = userStore.getState().memberId; // number type
        try {
          // `==` 연산자라 강제로 타입변환됨
          if (JSON.parse(inviteMsg).to == userStore.getState().memberId) {
            useRoomStore.getState().setInviteFlag(true);
            get().setInviteInfo(JSON.parse(inviteMsg));
          }
        } catch (err) {
          return err;
        }
      }
    });
  },

  inviteFriend: (friendId) => {
    //친구 초대
    const stompClient = get().stompClient;
    if (stompClient && stompClient.connected) {
      const room = useRoomStore.getState().currentRoom.roomId;
      const memberId = userStore.getState().memberId;
      const data = { roomId: room, from: memberId, to: friendId };

      stompClient.publish({
        destination: '/app/active/invite',
        body: JSON.stringify(data),
      });
    }
  },

  disconnect: () => {
    const stompClient = get().stompClient;
    if (stompClient && stompClient.connected) {
      stompClient.deactivate();
    }
    set({ stompClient: null });
  },

  setMyFriend: (friends) => {
    set((state) => ({ friendState: [...friends] }));
  },

  setInviteInfo: (info) => {
    set((state) => ({ inviteInfo: { ...info } }));
  },


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
  const inviteInfo = activeUserStore((state) => state.inviteInfo, shallow);

  const connect = activeUserStore((state) => state.connect);
  const subscribeMain = activeUserStore((state) => state.subscribeMain);

  const inviteFriend = activeUserStore((state) => state.inviteFriend);
  const disconnect = activeUserStore((state) => state.disconnect);
  const setMyFriend = activeUserStore((state) => state.setMyFriend);

  return {
    userState,
    friendState,
    inviteInfo,

    connect,
    inviteFriend,
    subscribeMain,
    disconnect,
    setMyFriend,
  };
};

export { activeUserStore };
