import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useTaleRoom } from '@/store/roomStore';
import { useTalePlay } from '@/store/tale/playStore';

import ParticipationStatus from '@/components/TaleRoom/ParticepationStatus';
import TaleNavigation from '@/components/Common/TaleNavigation';
import { Loading } from '@/common/Loading';
import AudioPlayer from '@/components/Common/AudioPlayer';

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
          style={{ backgroundImage: `url('/TaleStart/field-background.png')` }}>
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
                audioSrc={hotTale?.['voice']}
              />
            )}
          </div>

          <img
            className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] top-[195px]"
            src={hotTale?.['originImg']}
          />
          <img
            src={hotTale?.['originImg']}
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
