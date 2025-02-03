import React from 'react';
import { Link } from 'react-router-dom';

// 백에서 받아오는 정보 props로 넘겨서 수정할 것
// 그림 이미지, 그린 사람 프로필 이미지, 닉네임, 내가 추천 했는가, 몇 명이 좋아하는가
export default function GalleryItem() {
  return (
    <Link
      to={'/'}
      className="w-[210px] h-[300px] pb-0.5 bg-gray-50 border border-gray-200 flex-col justify-center items-start gap-[5px] inline-flex overflow-hidden">
      {/* 그림 이미지 주소 props 넣기 */}
      <img
        className="w-[210px] h-[210px] bg-center shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]"
        src="/Main/famous-drawing-test.png"
      />
      <div className="h-[83px] px-2 py-[7px] flex-col justify-start items-start gap-2.5 inline-flex overflow-hidden">
        <div className="self-stretch justify-start items-center gap-3 inline-flex overflow-hidden">
          {/* 그린 사람 프로필 이미지 주소 props 넣기 */}
          <img
            className="w-[35px] h-[35px] relative rounded-[100px]"
            src="/Main/profile-img.png"
          />
          {/* 그린 사람 닉네임 props 넣기 */}
          <div className="text-text-second service-regular3">
            그린 사람 닉네임
          </div>
        </div>
        <div className="justify-start items-center gap-2 inline-flex overflow-hidden">
          <div className="w-6 h-6">
            {/* 로그인 되어 있는 유저가 찜했는 가 안 했는가 조건부 렌더링 */}
            <img
              src="/Common/heart.png"
              alt="찜 아이콘"
            />
          </div>
          {/* 그림의 좋아요(추천) 수 */}
          <div className="text-text-second service-regular3">12</div>
        </div>
      </div>
    </Link>
  );
}
