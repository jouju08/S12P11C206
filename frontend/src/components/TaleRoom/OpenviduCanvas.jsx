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
    <div className="relative bg-white flex justify-center items-center text-text-third story-basic3 w-[236px] h-[168px] boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25) ">
      <div className="absolute top-0 left-0 bg-main-strawberry text-gray-500 p-1 text-xs">
        {local ? '' : participantIdentity}
      </div>
      <video
        ref={videoElement}
        id={track.sid}
      />
    </div>
  );
}
