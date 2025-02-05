import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTaleRoom } from '@/store/roomStore';
import { useTalePlay } from '@/store/tale/playStore';

import ParticipationStatus from '@/components/TaleRoom/ParticepationStatus';
import TaleNavigation from '@/components/Common/TaleNavigation';

// 확인용 더미데이터
const ParticipationList = [
  {
    id: 1,
    nickname: '더미데이터',
  },
];

const HotTale = () => {
  const { roomId } = useTalePlay();
  const [pageNum, setPageNum] = useState(0);
  const { hotTale, setHotTale } = useTalePlay();

  useEffect(() => {
    const handleHotTale = async () => {
      try {
        await setHotTale(pageNum);
      } catch (error) {
        console.error('Hot Tale Error 발생:', error);
      }
    };
    handleHotTale();
    console.log(pageNum);
  }, [pageNum]);

  return (
    // 전체 컨테이너 (1024x668)
    <div className="relative w-[1024px] h-[668px]">
      {/* 배경 필드 이미지 */}
      <div className="absolute inset-0">
        <img
          src="/TaleStart/field-background.png"
          alt="field background"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* 열린 책 이미지 */}
      <div className="absolute bottom-0 w-full">
        <img
          src="/TaleStart/open-book.png"
          alt="open book"
          className="w-full"
        />
      </div>

      {/* 참여인원 섹션 */}
      <div className="absolute top-4 left-[84px]">
        <ParticipationStatus ParticipationList={ParticipationList} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="absolute top-[370px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-[84px] flex justify-around items-center">
        {/* 스토리 이미지 */}
        <div className="mb-6">
          <img
            src={hotTale.originImg}
            alt="three pigs"
            className="w-[380px] mx-auto"
          />
        </div>

        {/* 텍스트 내용 */}
        <div className="text-center relative w-[380px] h-[350px] font-CuteFont text-text-first text-3xl leading-relaxed">
          {/* <p className="w-[285px] mx-auto after:content-[''] after:bg-white after:w-[319px] after:h-[368px] after:absolute after:inset-0 after:rounded-full after:blur-2xl"> */}
          <div className="w-[319px] h-[368px] absolute top-0 left-0 -z-10 bg-white rounded-[300px] blur-2xl opacity-90" />
          <p className="w-[285px] mx-auto">{hotTale.script}</p>
        </div>
      </div>

      <div className="absolute bottom-3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
        <TaleNavigation
          pageNum={pageNum}
          setPageNum={setPageNum}
        />
      </div>
    </div>
  );
};

export default HotTale;
