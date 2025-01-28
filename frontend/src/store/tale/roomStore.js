import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { shallow } from 'zustand/shallow';
import { devtools } from 'zustand/middleware';

const initialState = {
  rooms: [],
  currentRoom: null,
};

const roomActions = (set, get) => ({
  connect: () => {
    const socket = new SockJS(import.meta.env.VITE_WS_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Socket connected');
        get().subscribeToRooms();
      },
      onDisconnect: () => console.log('Disconnected'),
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
    }
  },

  joinRoom: (roomId, memberId) => {
    console.log('JOIN');
    const stompClient = get().stompClient;
    const room = { roomId, memberId };
    if (stompClient && stompClient.connect) {
      stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
        console.log(message);
        // get().setCurrentRoom(JSON.parse(message.body));
      });

      // 참가 요청
      client.publish({
        destination: `/app/room/join/${roomId}`,
        body: JSON.stringify(room),
      });
    }
  },

  leaveRoom: () => {
    `room/leave/roomId`;
    const { client, currentRoom } = get();
    if (client && currentRoom) {
      client.unsubscribe(`/topic/room/${currentRoom}/participants`);
      client.unsubscribe(`/topic/room/${currentRoom}`);
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
  devtools((set, get) => ({
    ...initialState,
    ...roomActions(set, get),
  }))
);

export const useTaleRoom = () => {
  const rooms = useRoomStore((state) => state.rooms, shallow);
  const currentRoom = useRoomStore((state) => state.currentRoom);
  const participants = useRoomStore((state) => state.participants, shallow);

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
