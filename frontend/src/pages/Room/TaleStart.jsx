import { Link, useNavigate } from 'react-router-dom';
import ParticipationStatus from '@/components/TaleRoom/ParticepationStatus';
import { useTalePlay } from '@/store/tale/playStore';
import { useEffect, useState, useRef } from 'react';
import { useRoomStore, useTaleRoom } from '@/store/roomStore';
import { useViduHook } from '@/store/tale/viduStore';
import { useUser } from '@/store/userStore';
import { Loading } from '@/common/Loading';

const TaleStart = () => {
  const {
    setBaseTale,
    setRoomId,
    setSubscribeTale,
    roomId,
    tale,
    setClient,
    resetState,
  } = useTalePlay();

  const {
    connectRoom,
    createRoom,
    startRoom,
    leaveRoom,

    setBaseTaleId,
    participants,
    currentRoom,

    resetStateRoom,
    isSingle,
    isEscape,
  } = useTaleRoom();

  const { getTokenByAxios, leaveViduRoom } = useViduHook();

  const { memberId } = useUser();

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTale = async () => {
      try {
        if (isSingle) {
          await connectRoom();
          const playRoom = await createRoom();

          setRoomId(playRoom.roomId);

          await startRoom();

          await setClient();

          await setSubscribeTale(playRoom.roomId);
        } else if (!isSingle) {
          setRoomId(currentRoom.roomId);

          await setClient();

          await setSubscribeTale(currentRoom.roomId);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTale();
  }, []);

  useEffect(() => {
    if (isEscape) {
      leaveRoom();
      leaveViduRoom();
      resetStateRoom();
      resetState();
      navigate('/room');
    }
  }, [isEscape]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="relative w-[1024px] h-[580px] tall:h-[668px]">
          {/* 배경 - 책 이미지 */}
          <img
            className="w-[1024px] h-[555px] absolute bottom-[18px] left-0"
            src="/Collection/modal-open-book.png"
          />
          {/* 음향 - 데이터 받아오면 바꾸기*/}
          <div className="text-right pr-20 mt-2">
            <AudioPlayer audioSrc={tale?.taleStartScriptVoice} />
          </div>

          {/* 참여인원 섹션 */}
          <div className="absolute top-4 left-[84px]">
            <ParticipationStatus ParticipationList={participants} />
          </div>

          {/* 메인 콘텐츠 영역 */}
          {/* 이미지와 스크립트는 absolute */}
          {/* 이미지 데이터 받아오면 바꾸기 */}
          <img
            className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] bottom-[133px]"
            src={tale?.taleStartImage}
          />
          <img
            src={tale?.taleStartImage}
            alt="동화 만든 이미지"
            className="w-[300px] h-[300px] z-10 absolute left-[168px] bottom-[153px]"
          />

          <div className="w-[378px] h-[430px] z-10 absolute right-[105px] bottom-[105px] flex justify-center items-center">
            <p className="text-text-first story-basic2">
              <span>{tale?.taleStartScript}</span>
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
      )}
    </>
  );
};

export default TaleStart;

// 컴포넌트로 빼기
const AudioPlayer = ({ audioSrc }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 자동 재생
    if (audioSrc !== null && audioSrc !== undefined && audioRef.current) {
      setIsMuted(false);
      audioRef.current.play();
    } else {
      setIsMuted(true);
    }
  }, [audioSrc]);

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
