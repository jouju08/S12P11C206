import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { shallow } from 'zustand/shallow';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import taleAPI from '@/apis/tale/taleAxios';
import { userStore } from './userStore';
import { immer } from 'zustand/middleware/immer';

const initialState = {
  currentRoom: null,
  stompClient: null,
  participants: [],
  baseTaleId: '',

  rawTale: null,
  isSingle: false,
  isStart: null,
};

const tabId = `tab-${Math.random().toString(36).substr(2, 9)}`;

const roomActions = (set, get) => ({
  //소켓 연결
  connect: async () => {
    return new Promise((resolve, reject) => {
      const socket = new SockJS(import.meta.env.VITE_WS_URL);

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

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const createRoom = get().currentRoom;
          if (createRoom) {
            get().joinRoom(createRoom.roomId, userStore.getState().memberId);
            resolve(createRoom);
          } else {
            reject(new Error('방 생성 실패'));
          }
        }, 1000);
      });
    } else {
      throw new Error('Stomp Client not connected');
    }
  },

  joinRoom: (roomId, memberId) => {
    const { stompClient, isStart } = get();
    const room = { roomId: roomId, memberId: memberId };

    if (stompClient && stompClient.connected) {
      // 참가 요청
      stompClient.publish({
        destination: `/app/room/join/${roomId}`,
        body: JSON.stringify(room),
      });

      stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        //들어간 방 상태
        get().setCurrentRoom(JSON.parse(message.body));

        //들어와 있는 방인원들
        const participants = JSON.parse(message.body)['participants'];

        get().addParticipant(participants);
      });

      //동화 시작
      stompClient.subscribe(`/topic/room/start/${roomId}`, (message) => {
        console.log(message.body);
        const parsedData = JSON.parse(message.body);

        // Deep copy
        const newData = JSON.parse(JSON.stringify(parsedData));

        set({ rawTale: newData });
      });

      stompClient.subscribe(`/topic/room/leave/${roomId}`, (message) => {
        const leaveData = JSON.parse(message.body);
        if (leaveData.leaveMemberId !== memberId) {
          get().setCurrentRoom(JSON.parse(message.body));

          const participants = JSON.parse(message.body)['participants'];

          get().addParticipant(participants);
        }
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
      stompClient.unsubscribe(`/topci/room/start/${currentRoom.roomId}`);

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
        baseTaleId: '',
        isSingle: false,
        isStart: null,
        rawTale: null,
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
  const currentRoom = useRoomStore((state) => state.currentRoom);
  const participants = useRoomStore((state) => state.participants);
  const baseTaleId = useRoomStore((state) => state.baseTaleId);
  const rawTale = useRoomStore((state) => state.rawTale, shallow);
  const isSingle = useRoomStore((state) => state.isSingle);
  const isStart = useRoomStore((state) => state.isStart);

  const setCurrentRoom = useRoomStore((state) => state.setCurrentRoom);
  const setParticipants = useRoomStore((state) => state.setParticipants);

  const addParticipant = useRoomStore((state) => state.addParticipant);
  const removeParticipant = useRoomStore((state) => state.removeParticipant);

  const connect = useRoomStore((state) => state.connect);
  const subscribeMain = useRoomStore((state) => state.subscribeMain);
  const createRoom = useRoomStore((state) => state.createRoom);
  const joinRoom = useRoomStore((state) => state.joinRoom);
  const startRoom = useRoomStore((state) => state.startRoom);
  const leaveRoom = useRoomStore((state) => state.leaveRoom);

  const setIsSingle = useRoomStore((state) => state.setIsSingle);
  const setIsStart = useRoomStore((state) => state.setIsStart);

  const setBaseTaleId = useRoomStore((state) => state.setBaseTaleId);

  return {
    currentRoom,
    participants,
    baseTaleId,
    isSingle,
    rawTale,
    isStart,

    setCurrentRoom,
    setParticipants,

    addParticipant,
    removeParticipant,
    connect,
    subscribeMain,
    createRoom,
    startRoom,
    joinRoom,
    leaveRoom,

    setIsSingle,
    setIsStart,
    setBaseTaleId,
  };
};

export { useRoomStore };
