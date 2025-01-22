import React, { useEffect } from 'react';
import useRoom from '../../hooks/socket/useRoom';
import { useTaleRoom } from '@/store/roomStore';

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
          <li key={room.id}>
            {room.id}
            <button onClick={() => joinRoom(room.id, room.memberId)}>
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
