import React, { useCallback, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useRoom = (roomId) => {
  const [stompClient, setStompClient] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const socket = new SockJS(import.meta.env.VITE_WS_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Socket connected');
        client.subscribe(`/topic/rooms`, (message) => {
          console.log(message.body);
          console.log(JSON.parse(message.body));
          setRooms((prev) => [...prev, JSON.parse(message.body)]);
        });
      },
      onDisconnect: () => console.log('Disconnected'),
      debug: (str) => console.log(str),
    });

    client.activate();
    setClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  const createRoom = () => {
    if (!client) {
      return console.error('Client is not connected');
    }

    console.log('create room');

    client.publish({
      destination: '/app/room/create',
      body: JSON.stringify({
        memberId: 1, // host id
        baseTaleId: 1,
        partiCnt: 4,
      }),
    });
  };

  const joinRoom = (roomId, username) => {
    try {
      client.publish({
        destination: `/app/room/join`,
        body: JSON.stringify({ roomId, username }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return { rooms, createRoom, joinRoom };
};

export default useRoom;
