import React from 'react';
import { useState } from 'react';

// sweetAlert2 with react
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// main page에서 창이 불러와 지기 전에 동화 방을 백에서 조회
// 커버, 인원, 방 번호, 책 이름, 방장 프로필, 닉네임
export default function FairyTaleRoom() {
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        console.log('바보');
      }}>
      <div className="w-[275px] h-[270px] bg-gray-50 rounded-[30px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.2)] flex-col justify-center items-start inline-flex overflow-hidden">
        <div className="w-[275px] h-[156px] overflow-hidden relative">
          {/* 백에서 가져온 cover 쓰기 */}
          <img
            className="w-[275px] bg-center"
            src="/Main/tale-cover-test.png"
          />
          <div className="w-[65px] px-4 py-1 absolute top-[8px] right-[13px] z-10 bg-main-beige rounded-xl">
            {/* 백에서 가져온 인원 수 쓰기 */}
            <div className="text-second service-regular3">1 / 4</div>
          </div>
        </div>
        <div className="pl-[17px] pr-5 pt-2 pb-2.5 justify-center items-center inline-flex overflow-hidden">
          <div className="w-[267px] self-stretch flex-col justify-start items-start inline-flex">
            {/* 백에서 가져온 방 번호 쓰기기 */}
            <div className="text-first font-NPSfont font-light text-[14px]">
              7번
            </div>
            <div className="self-stretch py-[5px] justify-between items-center inline-flex overflow-hidden">
              {/* 백에서 가져온 책 이름 쓰기기 */}
              <div className="w-[170px] text-first service-bold3">
                잠자는 숲 속의 공주
              </div>
            </div>
            <div className="justify-start items-center gap-3 inline-flex overflow-hidden">
              {/* 백에서 가져온 방장 프로필 쓰기기 */}
              <img
                className="w-[35px] h-[35px] relative rounded-[100px]"
                src="/Main/profile-img.png"
              />
              {/* 백에서 가져온온 닉네임 쓰기 */}
              <div className="text-secoond service-regular3">방장 닉네임</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
