import React, { useEffect } from 'react';
import useRoom from '../../hooks/socket/useRoom';
import { useTaleRoom } from '@/store/roomStore';
import CurrentRoom from './CurrentRoom';

export default function Lobby() {
  const { rooms, connect, createRoom, joinRoom, currentRoom } = useTaleRoom();

  useEffect(() => {
    connect();
  }, []);

  return (
    <div>
      <h2 className="text-2xl bg-slate-300">Game Rooms</h2>
      <button
        onClick={() => {
          createRoom();
        }}
        className="text-xl text-fuchsia-400">
        Create New Room
      </button>

      <ul>
        {rooms.map((room) => (
          <li key={room.roomId}>
            {room.roomId}
            <button onClick={() => joinRoom(room.roomId, 3)}>JOIN</button>
          </li>
        ))}
      </ul>
      <CurrentRoom />
    </div>
  );
}
