import { useTaleRoom } from '@/store/roomStore';
import React from 'react';

export default function CurrentRoom() {
  const { currentRoom, leaveRoom } = useTaleRoom();

  return (
    <div
      className={`${
        currentRoom ? 'absolute w-full h-full bg-red-200' : 'hidden'
      }`}>
      {JSON.stringify(currentRoom)}
      <br />

      <button onClick={() => leaveRoom()}>leaveRoom</button>
    </div>
  );
}
