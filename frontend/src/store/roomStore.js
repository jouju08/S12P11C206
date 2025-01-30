import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { shallow } from 'zustand/shallow';
import { devtools } from 'zustand/middleware';
import taleAPI from '@/apis/tale/taleAxios';
import { userStore } from './userStore';

const initialState = {
  rooms: [],
  currentRoom: null,
  stompClient: null,
  participants: {},
  memberId: userStore.getState().memberId,
};

const tabId = `tab-${Math.random().toString(36).substr(2, 9)}`;

const roomActions = (set, get) => ({
  connect: () => {
    console.log(get().memberId);
    const socket = new SockJS(import.meta.env.VITE_WS_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,

      onConnect: () => {
        console.log('Socket connected');
        get().subscribeToRooms();
        console.log(`${userStore.getState().accessToken}`);
      },

      connectHeaders: {
        Authorization: `Bearer ${userStore.getState().accessToken}`,
      },

      onDisconnect: () => console.log('Disconnected'),
      debug: (str) => console.log(str),
    });
    stompClient.activate();
    set({ stompClient });
  },

  subscribeToRooms: () => {
    const stompClient = get().stompClient;
    if (!stompClient || !stompClient.connected) {
      return;
    }

    stompClient.subscribe(`/topic/rooms`, (message) => {
      const newRoom = JSON.parse(message.body);
      get().addRoom(newRoom);
    });
  },

  subscribeToParticipants: (roomId) => {
    const stompClient = get().stompClient;
    if (!stompClient || !stompClient.connected) {
      return;
    }

    stompClient.subscribe(`topic/room/${roomId}`, (message) => {
      const participants = JSON.parse(message.body)['participants'];
      console.log(message);
      get().setParticipants(roomId, participants);
    });
  },

  createRoom: () => {
    const stompClient = get().stompClient;
    if (stompClient && stompClient.connected) {
      const data = {
        memberId: get().memberId,
        baseTaleId: 1,
        partiCnt: 4,
      };

      console.log(data);

      stompClient.publish({
        destination: '/app/room/create',
        body: JSON.stringify(data),
      });

      setTimeout(() => {
        const createRoom = get().rooms[get().rooms.length - 1];
        if (createRoom) {
          get().joinRoom(createRoom.roomId, get().memberId);
        }
      }, 500);
    }
  },

  joinRoom: (roomId, memberId) => {
    const stompClient = get().stompClient;
    const room = { roomId, memberId };

    if (stompClient && stompClient.connected) {
      // 참가 요청
      stompClient.publish({
        destination: `/app/room/join/${roomId}`,
        body: JSON.stringify(room),
      });

      stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        console.log(message);
        get().setCurrentRoom(JSON.parse(message.body));
      });

      stompClient.subscribe(`/topic/room/leave/${roomId}`, (message) => {
        const leaveData = JSON.parse(message.body);
        console.log(leaveData);
        if (leaveData.leaveMemberId !== memberId) {
          console.log(`${leaveData.memberId} has left the room`);
          get().setCurrentRoom([JSON.parse(message.body)]);
        }
      });

      console.log('JOIN');
    }
  },

  leaveRoom: () => {
    const { stompClient, currentRoom, memberId } = get();

    if (stompClient && stompClient.connected) {
      const room = { roomId: currentRoom.roomId, leaveMemberId: memberId };

      console.log(currentRoom.roomId);
      console.log(JSON.stringify(room));

      stompClient.publish({
        destination: `/app/room/leave/${currentRoom.roomId}`,
        body: JSON.stringify(room),
      });

      // stompClient.subscribe(`/topic/room/${currentRoom.roomId}`, (message) => {
      //   const response = JSON.parse(message.body);
      //   if (response.status === 'left') {
      //     console.log(`Member ${memberId} has left the room`);
      //     // 퇴장 성공 시 상태 업데이트
      //     set({ currentRoom: null, participants: [] });
      //   } else {
      //     console.log('Failed to leave room');
      //   }
      // });

      stompClient.unsubscribe(`/topic/room/${currentRoom.roomId}`);
      set({ currentRoom: null, participants: [] });
    }
  },

  setRooms: (rooms) => set({ rooms }),
  setCurrentRoom: (currentRoom) => set({ currentRoom }),
  setParticipants: (roomId, users) =>
    set((state) => ({
      participants: { ...state.participants, [roomId]: users },
    })),

  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  removeRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== roomId),
    })),

  addParticipant: (participant) =>
    set((state) => ({ participants: [...state.participants, participant] })),

  removeParticipant: (participantId) =>
    set((state) => ({
      participants: state.participants.filter(
        (participant) => participant.id !== participantId
      ),
    })),
});

const useRoomStore = create(
  devtools(
    (set, get) => ({
      ...initialState,
      ...roomActions(set, get),
    }),
    { name: `room-${tabId}` }
  )
);

export const useTaleRoom = () => {
  const rooms = useRoomStore((state) => state.rooms, shallow);
  const currentRoom = useRoomStore((state) => state.currentRoom);
  const participants = useRoomStore((state) => state.participants, shallow);
  const memberId = useRoomStore((state) => state.memberId);

  const setRooms = useRoomStore((state) => state.setRooms);
  const setCurrentRoom = useRoomStore((state) => state.setCurrentRoom);
  const setParticipants = useRoomStore((state) => state.setParticipants);

  const addRoom = useRoomStore((state) => state.addRoom);
  const removeRoom = useRoomStore((state) => state.removeRoom);
  const addParticipant = useRoomStore((state) => state.addParticipant);
  const removeParticipant = useRoomStore((state) => state.removeParticipant);

  const connect = useRoomStore((state) => state.connect);
  const createRoom = useRoomStore((state) => state.createRoom);
  const joinRoom = useRoomStore((state) => state.joinRoom);
  const leaveRoom = useRoomStore((state) => state.leaveRoom);

  const subscribeToRooms = useRoomStore((state) => state.subscribeToRooms);
  const subscribeToParticipants = useRoomStore(
    (state) => state.subscribeToParticipants
  );

  return {
    rooms,
    currentRoom,
    participants,
    memberId,

    setRooms,
    setCurrentRoom,
    setParticipants,
    addRoom,
    removeRoom,
    addParticipant,
    removeParticipant,
    connect,
    createRoom,
    joinRoom,
    leaveRoom,

    subscribeToRooms,
    subscribeToParticipants,
  };
};
