/**
 * author : Lim Chaehyeon (chaehyeon)
 * data : 2025.02.18
 * description : 헤더
 * React
 */

import React, { useEffect, useState } from 'react';
import { useRoomStore, useTaleRoom } from '@/store/roomStore';
import { useViduHook } from '@/store/tale/viduStore';
import { useTalePlay } from '@/store/tale/playStore';

export default function TaleRoomHeader({ onClose }) {
  const { baseTaleId, taleTitle, leaveRoom } = useTaleRoom();
  const { leaveViduRoom } = useViduHook();
  const { resetState } = useTalePlay();



  return (
    <header className="w-dvw bg-main-background shadow-md top-0 z-50">
      <nav className="w-[1024px] h-[100px] px-[20px] flex flex-row justify-between mx-auto items-center">
        <div className="w-[141px] h-[70px]">
          <img
            src="/Common/logo-blue.png"
            alt="로고"
            className="h-[70px]"
          />
        </div>
        {/* 책 이름 가져오기 */}
        <div className="text-text-first service-accent1">{taleTitle}</div>

        <CloseBtn onClose={onClose} />
      </nav>
    </header>
  );
}

const CloseBtn = ({ onClose }) => {


  return (
    <button
      onClick={onClose}
      className="h-[70px] pl-3 pr-5 bg-main-choose rounded-[100px] justify-center items-center inline-flex overflow-hidden">

      <img
        src="/Common/close.png"
        alt="나가기"
        className="w-[40px] h-[40px]"
      />
      <div className="text-white service-bold1 h-full leading-[70px]">
        나가기
      </div>
    </button>
  );
};
