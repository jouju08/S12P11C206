import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useTaleRoom } from '@/store/roomStore';
import { useTalePlay } from '@/store/tale/playStore';

import ParticipationStatus from '@/components/TaleRoom/ParticepationStatus';
import TaleNavigation from '@/components/Common/TaleNavigation';
import { Loading } from '@/common/Loading';
import AudioPlayer from '@/components/Common/AudioPlayer';

const HotTale = () => {
  const { roomId } = useTalePlay();
  const { tale, hotTale, setHotTale } = useTalePlay();

  const [pageNum, setPageNum] = useState(0);

  //메시지 수신 loading
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // if (pageNum !== 5) {
    const handleHotTale = async () => {
      try {
        await setHotTale(pageNum);
        setLoading(false);
      } catch (error) {
        console.error('Hot Tale Error 발생:', error);
      }
    };

    handleHotTale();
    // }
  }, [pageNum]);

  const handleClick = () => {
    navigate('/collection', { relative: 'path', replace: true });
  };

  const renderPageContent = (pageNum) => {
    if (pageNum === 5) {
      let today = new Date();

      return (
        <>
          <div className="flex flex-col gap-5">
            <p className="relative after:content[''] after:h-[20px] after:w-[85px] after:-z-10 after:absolute after:bottom-0 after:left-0 after:bg-main-strawberry">
              동화제목 : {hotTale['title']}
            </p>
            <div className="flex items-start gap-5">
              <p
                className="
            relative after:content[''] after:h-[20px] after:w-[65px] after:-z-10 after:absolute after:bottom-0 after:left-0 after:bg-main-strawberry">
                글쓴이 :
              </p>
              <ul className="pl">
                {hotTale['participants']?.map((item, idx) => (
                  <li key={{ idx }}>{item}</li>
                ))}
              </ul>
            </div>
            <p
              className="
            relative after:content[''] after:h-[20px] after:w-[90px] after:-z-10 after:absolute after:bottom-0 after:left-0 after:bg-main-strawberry">
              완성날짜 : {today.getFullYear()}년 {today.getMonth() + 1}월{' '}
              {today.getDate()}일
            </p>
          </div>

          {/* ai 동화 보러가기 */}
          <div className="w-[140px] h-32 pl-3.5 pt-1 bg-[url('/TaleStart/chat.png')] bg-contain object-contain bg-no-repeat absolute right-[65px] bottom-[-110px] service-regular3 text-text-first">
            AI 그림으로
            <br />
            동화 보러가기
          </div>
          <button
            onClick={() => handleClick()}
            className="w-20 h-20 bg-[url('/Room/together.png')] bg-contain bg-center object-center bg-no-repeat absolute right-[-20px] bottom-[-50px] service-regular2 text-text-first hover:scale-105 transition-all duration-200"
          />
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
        <div className="relative w-[1024px] h-[580px] tall:h-[668px]">
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

          {pageNum === 5 ? (
            <div>
              <img
                src={hotTale?.['coverImg']}
                alt="블러 처리 이미지"
                className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] bottom-[133px]"
              />
              <img
                src={hotTale?.['coverImg']}
                alt="동화 만든 이미지"
                className="w-[300px] h-[300px] z-10 absolute left-[168px] bottom-[153px]"
              />
            </div>
          ) : (
            <div>
              <img
                className="w-[340px] h-[340px] blur-[20px] absolute z-10 left-[148px] bottom-[133px]"
                src={hotTale?.['originImg']}
              />
              <img
                src={hotTale?.['originImg']}
                alt="동화 만든 이미지"
                className="w-[300px] h-[300px] z-10 absolute left-[168px] bottom-[153px]"
              />
            </div>
          )}

          <div className="w-[378px] h-[430px] z-10 absolute right-[105px] bottom-[105px] flex flex-col justify-center items-center text-text-first story-basic2">
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
