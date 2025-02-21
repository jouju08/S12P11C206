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
    <div className="relative w-[240px] h-[170px]  text-gray-500 story-basic3 ">
      <div className="absolute top-[5px] left-[5px] bg-main-strawberry p-1 text-sm">
        {local ? '' : participantIdentity}
      </div>
      <video
        className="border-[5px] border-[#a3825b] shadow-lg rounded-lg"
        ref={videoElement}
        id={track.sid}
      />
    </div>
  );
}
