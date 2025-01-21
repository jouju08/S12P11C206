import React, { useCallback, useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useRoom = () => {
  const [client, setClient] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState(
    'User' + Math.floor(Math.random() * 1000)
  );

  useEffect(() => {
    const socket = new SockJS('http://192.168.100.136:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Socket connected');
        client.subscribe(`/topic/rooms/`, (message) => {
          console.log(message.body);
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

    client.publish({
      destination: '/app/room/create',
      body: JSON.stringify({
        creatorId: `${userName}`,
        baseTaleId: 10,
        partiCnt: Math.floor(Math.random() * 4) + 1,
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
