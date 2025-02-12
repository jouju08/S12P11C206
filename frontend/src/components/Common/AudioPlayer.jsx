import React, { useState, useEffect, useRef } from 'react';

const AudioPlayer = ({ audioSrc, pageNum }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // 오디오 요소가 로드될 때마다 볼륨 설정
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;

      // onloadeddata 이벤트에서도 볼륨 설정
      audioRef.current.onloadeddata = () => {
        audioRef.current.volume = 0.3;
      };
    }
  }, [audioSrc]); // audioSrc가 변경될 때마다 실행

  // 페이지가 바뀔 때마다
  useEffect(() => {
    audioRef.current.currentTime = 0; // 처음으로 되감기
    audioRef.current.volume = 0.3; // 여기서도 볼륨 설정
    audioRef.current.play(); // 자동재생
    setIsMuted(false);
  }, [pageNum]);

  const handleToggleAudio = () => {
    if (isMuted) {
      audioRef.current.currentTime = 0; // 처음으로 되감기
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative">
      <audio
        ref={audioRef}
        src={audioSrc}
        autoPlay
        volume="0.2"
        onLoadedData={() => {
          if (audioRef.current) audioRef.current.volume = 0.3;
        }}
      />
      <button
        onClick={handleToggleAudio}
        className="w-20 h-20 focus:outline-none transition-transform duration-200 hover:scale-105">
        <img
          src={isMuted ? '/Collection/mute.png' : '/Collection/speaker.png'}
          alt={isMuted ? '음소거' : '재생'}
          className="w-full h-full object-contain"
        />
      </button>
    </div>
  );
};

export default AudioPlayer;
