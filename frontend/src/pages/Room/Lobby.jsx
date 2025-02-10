import React, { useEffect } from 'react';
import { useTaleRoom } from '@/store/roomStore';
import CurrentRoom from './CurrentRoom';
import { useViduHook } from '@/store/tale/viduStore';
import OpenviduCanvas from '@/components/TaleRoom/OpenviduCanvas';

export default function Lobby() {
  const { rooms, memberId, connect, createRoom, joinRoom, currentRoom } =
    useTaleRoom();

  const {
    getTokenByAxios,
    joinViduRoom,
    localTrack,
    remoteTracks,
    viduRoom,
    leaveViduRoom,
  } = useViduHook();

  useEffect(() => {
    connect();
  }, []);

  const viduTest = async () => {
    await getTokenByAxios(10);
    await joinViduRoom();
  };

  return (
    <div>
      <h2>{memberId}</h2>
      <h2 className="text-2xl bg-slate-300">Game Rooms</h2>
      <button
        onClick={() => {
          createRoom();
        }}
        className="text-xl text-fuchsia-400">
        Create New Room
      </button>

      <div>
        <p className="text-2xl">ME </p>
        <div>
          {localTrack && (
            <OpenviduCanvas
              track={localTrack}
              participantIdentity={memberId}
              local={true}
            />
          )}
        </div>
      </div>
      <div>
        {remoteTracks.length > 0 &&
          remoteTracks.map((remoteTrack) => (
            <OpenviduCanvas
              key={remoteTrack.trackPublication.trackSid}
              track={remoteTrack.trackPublication.track}
              participantIdentity={remoteTrack.participantIdentity}
            />
          ))}
      </div>

      <div>
        <button
          className="text-xl"
          onClick={() => viduTest()}>
          OpenVidu 테스트
        </button>
      </div>

      <ul>
        {rooms.map((room) => (
          <li key={room.roomId}>
            {room.roomId}
            <button onClick={() => joinRoom(room.roomId, parseInt(memberId))}>
              JOIN
            </button>
          </li>
        ))}
      </ul>
      <CurrentRoom />
    </div>
  );
}
