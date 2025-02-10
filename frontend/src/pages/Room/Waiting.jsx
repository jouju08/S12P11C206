import React, { Fragment, useEffect, useState } from 'react';
import Participant from '@/components/Waiting/Participant';
import { useTaleRoom } from '@/store/roomStore';
import { userStore, useUser } from '@/store/userStore';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Waiting() {
  const { participants, currentRoom, startRoom, isStart } = useTaleRoom();
  const { memberId } = useUser();

  const [isHost, setIsHost] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

  const handleStart = async () => {
    await startRoom();
  };

  useEffect(() => {
    const hostId = currentRoom.memberId;
    const isFull = currentRoom.full;

    console.log(isFull);
    console.log(hostId == memberId);

    //방장인지 판단
    if (hostId == memberId) {
      setIsHost(true);
    }

    //방장이면서 4명이 됬는지 판단해서 시작버튼 활성화
    if (isFull && hostId == memberId) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }

    return () => {
      setIsHost(false);
      setIsDisabled(false);
    };
  }, [currentRoom]);

  useEffect(() => {
    if (isStart == 'start') {
      navigate('/tale/taleStart');
    }

    return () => {};
  }, [isStart]);

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
            <span className="text-main-carrot">{4 - participants.length}</span>
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
          {participants.map((item, idx) => (
            <div
              key={item.id}
              className="w-full h-[60px] flex items-center justify-end gap-2">
              {/* 왼쪽에 방장은 모두 떠야하고, 내보내기는 방장만 보여야함 */}

              {item.id == currentRoom.memberId ? (
                // 내 로그인 정보와 이 방의 호스트 정보가 같다면
                <>
                  <div className="w-fit h-[32px] px-[10px] py-1 bg-main-success rounded-2xl justify-center items-center text-center text-text-first service-regular3">
                    {item.id == memberId ? `방장/나` : `방장`}
                  </div>
                  <Participant
                    item={item}
                    isHost={true}
                  />
                </>
              ) : item.id == memberId ? (
                <>
                  <div className="w-fit h-[32px] px-[10px] py-1 bg-main-kakao rounded-2xl justify-center items-center text-center text-text-first service-regular3">
                    나 !!
                  </div>
                  <Participant item={item} />
                </>
              ) : (
                <Participant item={item} />
              )}

              {/* 오른쪽 참여자 명단 부분 */}
            </div>
          ))}

          {/* 4자리 중 빈 자리 */}
          {Array.from({ length: 4 - participants.length }, (_, idx) => (
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

          <button
            onClick={handleStart}
            disabled={isDisabled}
            className={`h-16 px-4 py-3 absolute bottom-6 right-6 rounded-[64px] border-4 justify-start items-center gap-2.5 inline-flex overflow-hidden
              ${isDisabled ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed' : 'bg-white border-main-btn text-black'}
            `}>
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
