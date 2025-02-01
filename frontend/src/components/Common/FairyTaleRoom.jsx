import React from 'react';
import { useState } from 'react';

// sweetAlert2 with react
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// swal test, modal에는 추후 만들 방만들기 컴포넌트로 대체
const MyComponent = () => (
  <div>
    <h3 className="service-accent1">SweetAlert2 + React</h3>
    <p>이 모달은 나중에 width 100% height 100% 컴포넌트</p>
  </div>
);

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
  } = item;

  // 동화방 click 이벤트 발생 시, 모달 띄움
  const showGameModal = () => {
    withReactContent(Swal).fire({
      title: <i>확인용</i>,
      html: <MyComponent />, // 여기에 jsx 컴포넌트 가능
      showConfirmButton: true,
    });
  };

  return (
    <div
      className="cursor-pointer"
      onClick={showGameModal}>
      <div className="w-[275px] h-[270px] bg-gray-50 rounded-[30px] flex-col justify-center items-start inline-flex overflow-hidden">
        <div className="w-[275px] h-[156px] overflow-hidden relative">
          {/* 백에서 가져온 cover 쓰기 */}
          <img
            className="w-[275px] bg-center"
            src="/Main/tale-cover-test.png"
          />
          <div className="w-fit px-4 py-1 absolute top-[8px] right-[13px] z-10 bg-main-beige rounded-xl">
            {/* 백에서 가져온 인원 수 쓰기 */}
            <div className="text-text-second service-regular3">
              {participantsCnt} / {maxParticipantsCnt}
            </div>
          </div>
        </div>
        <div className="pl-[17px] pr-5 pt-2 pb-2.5 justify-center items-center inline-flex overflow-hidden">
          <div className="w-[267px] self-stretch flex-col justify-start items-start inline-flex">
            {/* 백에서 가져온 방 번호 쓰기기 */}
            <div className="text-text-first font-NPSfont font-light text-[14px]">
              {roomId}번
            </div>
            <div className="self-stretch py-[5px] justify-between items-center inline-flex overflow-hidden">
              {/* 백에서 가져온 책 이름 쓰기기 */}
              <div className="w-[170px] text-text-first service-bold3">
                {taleTitle}
              </div>
            </div>
            <div className="justify-start items-center gap-3 inline-flex overflow-hidden">
              {/* 백에서 가져온 방장 프로필 쓰기기 */}
              {hostProfileImg ? (
                <img
                  className="w-[35px] h-[35px] relative rounded-[100px]"
                  src={hostProfileImg}
                />
              ) : (
                <img
                  className="w-[35px] h-[35px] relative rounded-[100px]"
                  src="/Main/profile-img.png"
                />
              )}
              {/* 백에서 가져온온 닉네임 쓰기 */}
              <div className="text-text-second service-regular3">
                {hostNickname}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
