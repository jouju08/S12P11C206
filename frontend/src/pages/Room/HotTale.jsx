import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useTaleRoom } from '@/store/roomStore';
import { useTalePlay } from '@/store/tale/playStore';

import ParticipationStatus from '@/components/TaleRoom/ParticepationStatus';
import TaleNavigation from '@/components/Common/TaleNavigation';
import { Loading } from '@/common/Loading';
import AudioPlayer from '@/components/Common/AudioPlayer';

// 확인용 더미데이터
const ParticipationList = [
  {
    id: 1,
    nickname: '더미데이터',
  },
];

const HotTale = () => {
  const { roomId } = useTalePlay();
  const { hotTale, setHotTale } = useTalePlay();

  const [pageNum, setPageNum] = useState(0);

  //메시지 수신 loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageNum !== 5) {
      const handleHotTale = async () => {
        try {
          await setHotTale(pageNum);
          setLoading(false);
        } catch (error) {
          console.error('Hot Tale Error 발생:', error);
        }
      };

      handleHotTale();
    }
  }, [pageNum]);

  const renderPageContent = (pageNum) => {
    if (pageNum === 5) {
      return (
        <>
          {/* <p>동화제목 : {hotTale['hotTaleTitle']}</p> */}
          <p>동화제목 : 무엇일까요</p>
          <p>글쓴이 : 누구일까요</p>
          <p>완성날짜 : 언제일까요</p>
        </>
      );
    } else {
      return <span>{hotTale?.['script']}</span>;
    }
  };

  return (
    // 전체 컨테이너 (1024x668)
    <>
      {loading ? (
        <Loading />
      ) : (
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
            {pageNum === 5 ? null : (
              <AudioPlayer
                pageNum={pageNum}
                audioSrc="/Collection/test-audio.wav"
              />
            )}
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

          <div className="w-[378px] h-[430px] z-10 absolute right-[105px] top-[140px] flex flex-col justify-center items-center text-text-first story-basic2">
            {renderPageContent(pageNum)}
          </div>

          <div className="absolute bottom-3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
            <TaleNavigation
              maxNum={5}
              pageNum={pageNum}
              setPageNum={setPageNum}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HotTale;

// 컴포넌트로 빼기
// const AudioPlayer = ({ audioSrc, pageNum }) => {
//   const [isMuted, setIsMuted] = useState(false);
//   const audioRef = useRef(null);

//   // 페이지가 바뀔 때마다
//   useEffect(() => {
//     audioRef.current.currentTime = 0; // 처음으로 되감기
//     audioRef.current.play(); // 자동재생
//     setIsMuted(false);
//   }, [pageNum]);

//   const handleToggleAudio = () => {
//     if (isMuted) {
//       audioRef.current.currentTime = 0; // 처음으로 되감기
//       audioRef.current.play();
//     } else {
//       audioRef.current.pause();
//     }
//     setIsMuted(!isMuted);
//   };

//   return (
//     <div className="relative">
//       <audio
//         ref={audioRef}
//         src={audioSrc}
//         autoPlay
//       />
//       <button
//         onClick={handleToggleAudio}
//         className="w-20 h-20 focus:outline-none transition-transform duration-200 hover:scale-105">
//         <img
//           src={isMuted ? '/Collection/mute.png' : '/Collection/speaker.png'}
//           alt={isMuted ? '음소거' : '재생'}
//           className="w-full h-full object-contain"
//         />
//       </button>
//     </div>
//   );
// };
