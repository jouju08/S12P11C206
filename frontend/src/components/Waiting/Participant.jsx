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
            src={
              item.profileImg
              ? item.profileImg
              : "/Main/profile-img.png"
            }
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
            src="https://s3-alpha-sig.figma.com/img/2636/887b/f96b32cd3d47227a405de29ea35b103f?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=n1Gcq01rzJYZd-mj~TIdXttFK23oiANMSDjTtdhD6WwJN2dN3ft-hKpTz~ltT10S7dpd-5SrIARoSp-6nRBqWuic0l5vktFIZKr4GPxLW0BzlwS3O2mEn178bb8073VseO6Owo-QZZvLuCyOaeft~4FO56OEn1z1y6FpnOgiv1iN5XQaVFv0S7xBCbz6ZLW71sKBBTZqoaysGTwb0i3QilYDF0QLF01seRozwjXaDs1Z5YT8x7ME26LqfIsO2tfsOzKORAJHQbqf7utUhigBhMdpGbo1u9C1QRmBysC2uj0l7dr5L~ah2Gtv2lQ5YtSWqKY8X0Bil7SNFgcli7SK9Q__"
          />
        ) : (
          <ChildrenBtn isFriend={isFriend} />
        )}
      </div>
    </div>
  );
};

export default Participant;
