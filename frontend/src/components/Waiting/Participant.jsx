import React, { useEffect, useState } from 'react';
import ChildrenBtn from './ChildrenBtn';
import { useTaleRoom } from '@/store/roomStore';

const Participant = ({ item, isHost = false }) => {
  const { id, isFriend, nickname, profileImg } = item;
  const { currentRoom } = useTaleRoom();

  return (
    <div
      className={`w-[310px] h-[58px] rounded-[30px] overflow-hidden ${
        isFriend === 'me' ? 'border-2 border-main-carrot' : ''
      }`}>
      <div className="flex items-center justify-between px-2.5 py-[7px] relative bg-white rounded-[30px] overflow-hidden">
        <div className="overflow-hidden w-[45px] h-[45px] rounded-full">
          <img
            src={item.profileImg ? item.profileImg : '/Main/profile-img.png'}
            alt="프로필 이미지"
            className="w-[45px]"
          />
        </div>
        <div className="absolute top-3 left-[72px] text-text-first service-regular1">
          {item.nickname}
        </div>
        {isHost ? (
          <img
            className="w-[34px] h-[34px] left-[14px] top-[-11.50px] absolute"
            src="/Waiting/crown.gif"
          />
        ) : (
          <ChildrenBtn isFriend={isFriend} />
        )}
      </div>
    </div>
  );
};

export default Participant;
