import React, { Fragment, useState } from 'react';
import Participant from '@/components/Waiting/Participant';
import { useTaleRoom } from '@/store/roomStore';
import { userStore } from '@/store/userStore';

// 더미 데이터
const dummyParticipants = [
  {
    id: 1,
    isFriend: 'me',
    nickname: 'test1',
    profileImg: '/Main/profile-img.png',
    isHost: true,
  },
  {
    id: 2,
    isFriend: 'yes',
    nickname: 'test2',
    profileImg: '/Main/profile-img.png',
    isHost: false,
  },
  {
    id: 3,
    isFriend: 'no', //yet도 해볼것
    nickname: 'test3',
    profileImg: '/Main/profile-img.png',
    isHost: false,
  },
];

export default function Waiting() {
  // memberId가 호스트 번호?
  const { participants, memberId } = useTaleRoom();
  // 여기 memberId는 로그인한 사람 id? 겹치네..
  // const {memberId} = userStore();

  return (
    <div className="w-[1021px] h-[668px] relative">
      {/* 배경 필드 이미지 */}
      <img
        className="w-[1024px] h-[668px] absolute top-0 left-0 -z-10"
        src="/Waiting/field-background.png"
      />

      {/* 요정 말풍선 */}
      <div
        style={{ backgroundImage: "url('/Waiting/waiting-chat-bubble.png')" }}
        className="w-[530px] h-[232px] pl-[30px] absolute top-10 right-16 flex flex-col justify-center items-center">
        <div className="h-fit flex-col justify-center items-center gap-[20px] flex overflow-hidden">
          <div className="text-text-first font-CuteFont text-[25px] text-center">
            <span className="text-main-carrot">
              {4 - dummyParticipants.length}
            </span>{' '}
            명이 오면 시작할 수 있어 <br /> 조금만 더 기다려보자~
          </div>
          {/* 내가 방장이라면 */}
          <div className="relative group">
            <button className="service-bold3 w-fit h-fit px-5 py-2 bg-[#ffc300] rounded-[50px] hover:bg-main-carrot transition-all ease-linear">
              내 친구 초대하기
            </button>
            <div className="absolute top-0 -right-6 -scale-x-100 opacity-0 -translate-x-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-active:opacity-100 group-active:translate-x-0">
              <img
                src="/Waiting/children-btn.png"
                alt="토끼 이미지"
                className="h-[42px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 요정 이미지 */}
      <div className="w-[200px] h-[269px] absolute top-[50px] left-[110px] flex justify-center items-center">
        <img
          className="w-[191px] h-[266px]"
          src="/Waiting/waiting-fairy.png"
        />
      </div>

      {/* 참여자 명단과 동화 정보 flex-row */}
      <div className="w-full h-fit flex justify-between items-center mt-[340px] px-[25px]">
        {/* 참여자 명단 */}
        <div className="w-[410px] h-[300px] relative flex flex-col gap-3">
          {dummyParticipants.map((item, idx) => (
            <div
              key={idx}
              className="w-full h-[60px] flex items-center justify-end gap-2">
              {item.isHost ? (
                <div className="w-fit h-[32px] px-[10px] py-1 bg-main-success rounded-2xl justify-center items-center text-center text-text-first service-regular3">
                  방장
                </div>
              ) : (
                // 내 로그인 정보와 이 방의 호스트 정보가 같다면
                <GetOut />
              )}

              <Participant item={item} />
            </div>
          ))}

          {/* 4자리 중 빈 자리 */}
          {Array.from({ length: 4 - dummyParticipants.length }, (_, idx) => (
            <div className="w-full h-[60px] leading-[60px] bg-gray-300 rounded-[30px] text-center text-text-white service-regular1">
              같이 할 친구를 기다려봐요!
            </div>
          ))}
        </div>

        {/* 동화책 */}
        <div className="w-fit h-[270px] flex gap-10 items-center overflow-hidden pr-10">
          <img
            className="w-40 h-[220px] inline-block"
            src="/Main/tale-cover-test.png"
          />
          <div>
            <h1 className="service-accent2 text-text-first mb-7">
              아기 돼지 삼형제
            </h1>
            <p className="story-basic2 text-text-second">
              무슨 내용을 바꿔볼까요?
              <br />
              시작할 때까지 조금만
              <br />
              기다려보아요!
            </p>
          </div>

          {/* 4명 다 모이면 출발 버튼 */}
          {/* 로그인 되어있는 내가 방장이라면 */}
          <button className="h-16 px-4 py-3 absolute bottom-6 right-6 bg-white rounded-[64px] border-4 border-main-btn justify-start items-center gap-2.5 inline-flex overflow-hidden">
            <img
              src="/Waiting/play.png"
              alt="출발버튼"
            />
            <div className="text-text-first service-bold2">출발하기</div>
          </button>
        </div>
      </div>
    </div>
  );
}

const GetOut = () => {
  return (
    <button className="w-fit h-[32px] px-[10px] py-1 bg-main-choose rounded-2xl justify-center items-center text-center text-text-white service-regular3 transition-all ease-linear hover:scale-105">
      내보내기
    </button>
  );
};
