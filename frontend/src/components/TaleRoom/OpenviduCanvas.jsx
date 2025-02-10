import { LocalVideoTrack, RemoteVideoTrack } from 'livekit-client';
import { useEffect, useRef } from 'react';

export default function OpenviduCanvas({
  track,
  participantIdentity,
  local = false,
}) {
  const videoElement = useRef(null);

  useEffect(() => {
    if (videoElement.current) {
      track.attach(videoElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <div
      id={participantIdentity}
      className="bg-white">
      <div className="bg-red-400">
        <p>{participantIdentity + (local ? ' (You)' : '')}</p>
      </div>
      <video
        ref={videoElement}
        id={track.sid}></video>
    </div>
  );
}
