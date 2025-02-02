import React, { useEffect } from 'react';
import TaleAudioPlayer from './TaleAudioPlayer';
import TalePicturePlayer from './TalePicturePlayer';
import Playground from '@/components/Play/Single/Playground';
import { useTalePlay } from '@/store/tale/playStore';
import { useTaleRoom } from '@/store/roomStore';
import { create } from 'zustand';

export default function TalePlay() {
  const { setBaseTale, setRoomId, roomId } = useTalePlay();
  const { connect, createRoom } = useTaleRoom();

  const handleTale = async () => {
    try {
      const playRoom = await createRoom();

      setRoomId(playRoom.roomId);

      await setBaseTale();
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <>
      <div>
        <button
          className=""
          onClick={handleTale}>
          TaleStart
        </button>
      </div>
      <div>{roomId}</div>
      <div className="w-full h-screen">
        <Playground
          picture={<TalePicturePlayer />}
          audio={<TaleAudioPlayer />}
        />
      </div>
    </>
  );
}
