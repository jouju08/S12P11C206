import React from 'react';
import { useState } from 'react';
import TaleLayout from '@/common/layout/TaleLayout';
import Lobby from '@/pages/Room/Lobby';
import { useNavigate } from 'react-router-dom';

import '@/styles/swalModal.css';
import { useTaleRoom } from '@/store/roomStore';
import { userStore, useUser } from '@/store/userStore';

// main page에서 창이 불러와 지기 전에 동화 방을 백에서 조회
// 커버, 인원, 방 번호, 책 이름, 방장 프로필, 닉네임
export default function FairyTaleRoom({ item }) {
  // taleCover도 추가될거에요!
  const {
    hostMemberId,
    hostNickname,
    hostProfileImg,
    maxParticipantsCnt,
    participantsCnt,
    roomId,
    taleTitle,
    taleTitleImg,
  } = item;

  const { connectRoom, joinRoom } = useTaleRoom();
  const { memberId } = useUser();

  const navigate = useNavigate();

  const handleJoinTale = async () => {
    await connectRoom();
    await joinRoom(roomId, memberId);
    navigate('/tale/waiting', { relative: 'path' });
  };

  return (
    <div
      className="cursor-pointer"
      onClick={() => handleJoinTale()}>
      {/* 클릭하면 lobby로 리다이렉트 하자 */}
      <div className="w-[275px] w- h-[300px] bg-gray-50 rounded-[30px] flex-col justify-between items-start inline-flex overflow-hidden">
        <div className="w-[275px] h-[186px] overflow-hidden relative">
          {/* 백에서 가져온 cover 쓰기 */}
          <img
            className="w-[275px] -translate-y-10"
            src={taleTitleImg}
          />
          <div className="w-fit px-4 py-1 absolute top-[8px] right-[13px] z-10 bg-main-beige rounded-xl">
            {/* 오른쪽 위 인원 수 */}
            <div className="text-text-second service-regular3">
              {participantsCnt} / {maxParticipantsCnt}
            </div>
          </div>
        </div>
        <div className="px-4 py-4 flex flex-col gap-1">
          {/* 방 번호 */}
          <div className="text-text-first font-NPSfont font-light text-left text-[14px]">
            {roomId} 번
          </div>

          {/* 책 이름 */}
          <div className="w-fit text-text-first service-bold3">{taleTitle}</div>

          <div className="flex justify-start items-center gap-3 overflow-hidden">
            {/* 방장 프로필 */}
            <img
              className="w-[25px] h-[25px] relative rounded-full"
              src={hostProfileImg}
            />
            {/* 방장 닉네임 */}
            <div className="text-text-second service-regular3">
              {hostNickname}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
