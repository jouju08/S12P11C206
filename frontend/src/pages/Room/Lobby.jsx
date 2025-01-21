import React from 'react';
import useRoom from '../../hooks/socket/useRoom';

export default function Lobby() {
  const { rooms, createRoom, joinRoom } = useRoom();

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      <ul>
        <span>
          <br />
          <h2 className="text-2xl">Room List</h2>
        </span>
        {rooms.map((room, index) => (
          <li key={index}>
            {room.roomId} - {room.creatorId}
            <button onClick={() => joinRoom(room.roomId, 'MyUsername')}>
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
