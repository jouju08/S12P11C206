import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { shallow } from 'zustand/shallow';
import { devtools } from 'zustand/middleware';

const initialState = {
  client: null,
  rooms: [],
  currentRoom: null,
  participants: [],
};

const roomActions = (set, get) => ({
  connect: () => {
    const socket = new SockJS('http://192.168.100.136:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Socket connected');
        stompClient.subscribe('/topic/rooms', (message) => {
          console.log(JSON.parse(message.body));
          set((state) => ({
            rooms: [...state.rooms, JSON.parse(message.body)],
          }));
        });

        set({ client: stompClient });

        // 방목록 요청
        stompClient.publish({
          destination: '/app/room/create',
          body: JSON.stringify({
            memberId: 1, // host id
            baseTaleId: 1,
            partiCnt: 4,
          }),
        });
      },
      onDisconnect: () => console.log('Disconnected'),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });
    stompClient.activate();
  },

  createRoom: () => {
    const { client } = get();
    if (client) {
      client.publish({
        destination: '/app/room/create',
        body: JSON.stringify({
          memberId: 1, // host id
          baseTaleId: 1,
          partiCnt: 4,
        }),
      });
    }
  },

  joinRoom: (roomId, memberId) => {
    const { client } = get();
    if (client) {
      get().leaveRoom(); // disconnect

      client.subscribe(`/topic/room/${roomId}/participants`, (message) => {
        set({ participants: JSON.parse(message.body) });
      });

      client.subscribe(`/topic/room/${roomId}`, (message) => {
        console.log('JOIN ROOM');
      });

      const room = { roomId, memberId };

      // 참가 요청
      client.publish({
        destination: `/app/room/join/${roomId}`,
        body: JSON.stringify(room),
      });

      set({ currentRoom: roomId, participants: [] });
    }
  },

  leaveRoom: () => {
    const { client, currentRoom } = get();
    if (client && currentRoom) {
      // client.unsubscribe(`/topic/room/${currentRoom}/participants`);
      client.unsubscribe(`/topic/room/${currentRoom}`);
      set({ currentRoom: null, participants: [] });
    }
  },

  setRooms: (rooms) => set({ rooms }),
  setCurrentRoom: (currentRoom) => set({ currentRoom }),
  setParticipants: (participants) => set({ participants }),

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
  };
};
