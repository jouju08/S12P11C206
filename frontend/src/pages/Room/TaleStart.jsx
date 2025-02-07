import { Link } from 'react-router-dom';
import ParticipationStatus from '@/components/TaleRoom/ParticepationStatus';
import { useTalePlay } from '@/store/tale/playStore';
import { useEffect, useState, useRef } from 'react';
import { useTaleRoom } from '@/store/roomStore';

// 확인용 더미데이터
const ParticipationList = [
  {
    id: 1,
    nickname: '더미데이터',
  },
];

const TaleStart = () => {
  const { setBaseTale, setRoomId, setSubscribeTale, roomId } = useTalePlay();
  const { connect, createRoom } = useTaleRoom();

  useEffect(() => {
    const handleTale = async () => {
      try {
        await connect();
        const playRoom = await createRoom();

        setRoomId(playRoom.roomId);

        await setBaseTale();
        await setSubscribeTale(playRoom.roomId);
      } catch (error) {
        console.error('Tale Start Error 발생:', error);
      }
    };
    handleTale();
  }, []);

  return (
    // 전체 컨테이너 (1024x668)
    <div
      className="relative w-[1024px] h-[668px]"
      style={{ backgroundImage: "url('/TaleStart/field-background.png')" }}>
      {/* 배경 - 책 이미지 */}
      <img
        className="w-[1024px] h-[555px] absolute bottom-[18px] left-0"
        src="/Collection/modal-open-book.png"
      />
      {/* 음향 - 데이터 받아오면 바꾸기*/}
      <div className="text-right pr-20 mt-2">
        <AudioPlayer audioSrc="/Collection/test-audio.wav" />
      </div>

      {/* 참여인원 섹션 */}
      <div className="absolute top-4 left-[84px]">
        <ParticipationStatus ParticipationList={ParticipationList} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      {/* 이미지와 스크립트는 absolute */}
      {/* 이미지 데이터 받아오면 바꾸기 */}
      <img
        className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] top-[195px]"
        src="/TaleStart/test-story-start.jpg"
      />
      <img
        src="/TaleStart/test-story-start.jpg"
        alt="동화 만든 이미지"
        className="w-[300px] h-[300px] z-10 absolute left-[168px] top-[215px]"
      />

      <div className="w-[378px] h-[430px] z-10 absolute right-[105px] top-[140px] flex justify-center items-center">
        <p className="text-text-first story-basic2">
          옛날 옛적에 아기돼지 삼형제가 살고 있었습니다.
          <br />
          이들은 각자 자신만의 집을 짓기로 결정했어요.
          <br />
          늑대는 첫째 돼지의 집에 와서 말했어요.
          <br />
          "문을 열어라!"
        </p>
      </div>

      {/* 다음 화살표 */}
      <Link
        to={'/tale/taleKeyword'}
        className="absolute bottom-3 right-3">
        <img
          src="/Common/arrow-left.png"
          alt="다음 화살표"
          className="w-[50px] h-[50px] -scale-x-100"
        />
      </Link>
    </div>
  );
};

export default TaleStart;

// 컴포넌트로 빼기
const AudioPlayer = ({ audioSrc }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 자동 재생
    audioRef.current.play();
  }, []);

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
