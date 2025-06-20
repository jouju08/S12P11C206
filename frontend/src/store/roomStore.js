import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { shallow } from 'zustand/shallow';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import taleAPI from '@/apis/tale/taleAxios';
import { api, userStore } from './userStore';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  currentRoom: null,
  stompClient: null,
  participants: [],
  baseTaleId: null,
  taleTitle: null,

  rawTale: null,
  isSingle: false,
  isStart: null,
  inviteFlag: false,
  isEscape: false,
};

const tabId = `tab-${Math.random().toString(36).substr(2, 9)}`;

const roomActions = (set, get) => ({
  //소켓 연결
  connectRoom: async () => {
    return new Promise((resolve, reject) => {
      const socket = new SockJS('/ws');

      const stompClient = new Client({
        webSocketFactory: () => socket,

        onConnect: () => {
          get().subscribeMain();
          resolve(stompClient);
        },

        connectHeaders: {
          Authorization: `Bearer ${userStore.getState().accessToken}`,
        },

        onDisconnect: () => {},
        debug: (str) => {},
      });

      stompClient.activate();

      set({ stompClient });
    });
  },

  subscribeMain: async () => {
    const stompClient = get().stompClient;

    if (!stompClient || !stompClient.connected) {
      return;
    }

    stompClient.subscribe(`/topic/rooms`, (message) => {
      const newRoom = JSON.parse(message.body);
      get().setCurrentRoom(newRoom);
    });
  },

  createRoom: async () => {
    const stompClient = get().stompClient;
    if (stompClient && stompClient.connected) {
      const data = {
        memberId: userStore.getState().memberId,
        baseTaleId: get().baseTaleId,
        partiCnt: 4,
      };

      stompClient.publish({
        destination: '/app/room/create',
        body: JSON.stringify(data),
      });

      const res = await taleAPI.getTaleInfo(get().baseTaleId || 1);

      set({ taleTitle: res.data.data.title || '' });

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const createRoom = get().currentRoom;

          if (createRoom) {
            get().joinRoom(createRoom.roomId, userStore.getState().memberId);
            resolve(createRoom);
          } else {
            reject(new Error('방 생성 후 참가 실패'));
          }
        }, 1000);
      });
    } else {
      throw new Error('Stomp Client not connected');
    }
  },

  joinRoom: async (roomId, memberId) => {
    const { stompClient, isStart } = get();
    const room = { roomId: roomId, memberId: memberId };

    if (stompClient && stompClient.connected) {
      stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        //방 상태
        get().setCurrentRoom(JSON.parse(message.body));

        //들어와 있는 방인원들
        const participants = JSON.parse(message.body)['participants'];

        get().addParticipant(participants);
      });

      //동화 시작
      stompClient.subscribe(`/topic/room/start/${roomId}`, (message) => {
        const parsedData = JSON.parse(message.body);

        // Deep copy
        const newData = JSON.parse(JSON.stringify(parsedData));

        set({ rawTale: newData });
      });

      //나가기
      stompClient.subscribe(`/topic/room/leave/${roomId}`, (message) => {
        const leaveData = JSON.parse(message.body);
        if (leaveData.leaveMemberId !== memberId) {
          get().setCurrentRoom(JSON.parse(message.body));

          const participants = JSON.parse(message.body)['participants'];

          get().addParticipant(participants);
        }
      });

      //탈주 감지
      stompClient.subscribe(
        `/topic/room/escape/before/${roomId}`,
        (message) => {
          if (message.body === 'break') {
            get().setIsEscape(true);
          }
        }
      );

      stompClient.subscribe(
        `/topic/room/escape/after/${roomId}/${memberId}`,
        (message) => {
          get().setIsEscape(true);
        }
      );

      // 참가 요청
      stompClient.publish({
        destination: `/app/room/join/${roomId}`,
        body: JSON.stringify(room),
      });

      const res = await taleAPI.getTaleInfo(get().baseTaleId);

      set({ taleTitle: res.data.data.title || '' });

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const joinRoom = get().currentRoom;
          if (joinRoom) {
            resolve(joinRoom);
          } else {
            reject(new Error('방 참가 실패'));
          }
        }, 1000);
      });
    }
  },

  startRoom: async () => {
    const { stompClient, currentRoom, isStart } = get();

    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: `/app/room/start/${currentRoom.roomId}`,
        body: JSON.stringify(currentRoom),
      });
    }
  },

  leaveRoom: () => {
    const { stompClient, currentRoom } = get();

    if (stompClient && stompClient.connected) {
      const room = {
        roomId: currentRoom.roomId,
        leaveMemberId: userStore.getState().memberId,
      };

      stompClient.publish({
        destination: `/app/room/leave/${currentRoom.roomId}`,
        body: JSON.stringify(room),
      });

      stompClient.unsubscribe(`/topic/rooms`);
      stompClient.unsubscribe(`/topic/room/${currentRoom.roomId}`);
      stompClient.unsubscribe(`/topic/room/leave/${currentRoom.roomId}`);
      stompClient.unsubscribe(`/topic/room/start/${currentRoom.roomId}`);

      // 연결 해제
      if (stompClient !== null) {
        stompClient.deactivate();
        if (stompClient.webSocket !== null) {
          stompClient.webSocket.close();
        }
      }

      set({
        currentRoom: null,
        participants: [],

        baseTaleId: null,
        taleTitle: null,

        rawTale: null,
        isSingle: false,
        isStart: null,
        inviteFlag: false,
      });
    }
  },

  setCurrentRoom: (currentRoom) => set({ currentRoom }),

  // setParticipants: (roomId, users) =>
  //   set((state) => ({ participants: [...state.participants, participant] })),

  addParticipant: (participant) =>
    set((state) => ({
      participants: [...Object.values(participant)],
    })),

  removeParticipant: (participantId) =>
    set((state) => ({
      participants: state.participants.filter(
        (participant) => participant.id !== participantId
      ),
    })),

  setIsSingle: (value) => set({ isSingle: value }),
  setIsStart: (value) => set({ isStart: value }),
  setBaseTaleId: (id) =>
    set((state) => ({
      baseTaleId: state.baseTaleId == id ? '' : id,
    })),

  setInviteFlag: (value) => set({ inviteFlag: value }),
  setIsEscape: (value) => set({ isEscape: value }),
});

const useRoomStore = create(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,
        ...roomActions(set, get),
        resetState: () => set(() => ({ ...initialState })),
      }))
    ),
    { name: `room-${userStore.getState().memberId}` }
  )
);

export const useTaleRoom = () => {
  const stompClient = useRoomStore((state) => state.stompClient);
  const currentRoom = useRoomStore((state) => state.currentRoom);
  const participants = useRoomStore((state) => state.participants);
  const baseTaleId = useRoomStore((state) => state.baseTaleId);
  const taleTitle = useRoomStore((state) => state.taleTitle);
  const rawTale = useRoomStore((state) => state.rawTale, shallow);
  const isSingle = useRoomStore((state) => state.isSingle);
  const isStart = useRoomStore((state) => state.isStart);
  const inviteFlag = useRoomStore((state) => state.inviteFlag);

  const setCurrentRoom = useRoomStore((state) => state.setCurrentRoom);
  const setParticipants = useRoomStore((state) => state.setParticipants);

  const addParticipant = useRoomStore((state) => state.addParticipant);
  const removeParticipant = useRoomStore((state) => state.removeParticipant);

  const connectRoom = useRoomStore((state) => state.connectRoom);
  const subscribeMain = useRoomStore((state) => state.subscribeMain);
  const createRoom = useRoomStore((state) => state.createRoom);
  const joinRoom = useRoomStore((state) => state.joinRoom);
  const startRoom = useRoomStore((state) => state.startRoom);
  const leaveRoom = useRoomStore((state) => state.leaveRoom);

  const setIsSingle = useRoomStore((state) => state.setIsSingle);
  const setIsStart = useRoomStore((state) => state.setIsStart);

  const setBaseTaleId = useRoomStore((state) => state.setBaseTaleId);
  const setInviteFlag = useRoomStore((state) => state.setInviteFlag);

  const isEscape = useRoomStore((state) => state.isEscape);
  const setIsEscape = useRoomStore((state) => state.setIsEscape);
  const resetStateRoom = useRoomStore((state) => state.resetState);

  return {
    stompClient,

    currentRoom,
    participants,
    baseTaleId,
    isSingle,
    taleTitle,
    rawTale,
    isStart,
    inviteFlag,

    setCurrentRoom,
    setParticipants,

    addParticipant,
    removeParticipant,
    connectRoom,
    subscribeMain,
    createRoom,
    startRoom,
    joinRoom,
    leaveRoom,

    setIsSingle,
    setIsStart,
    setBaseTaleId,

    setInviteFlag,

    isEscape,
    setIsEscape,
    resetStateRoom,
  };
};

export { useRoomStore };
